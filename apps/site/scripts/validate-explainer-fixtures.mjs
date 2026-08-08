/** Validate src/data/library-explainer/ against the schema the engine ships
    with the fixtures (explainer.schema.json), plus the code-level checks the
    schema's description documents — the ajv half of the two-validator drift
    guard (the engine validates the same document with Python jsonschema on
    export; see experiments/library_explainer in the engine repo). */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Ajv2020 } from 'ajv/dist/2020.js';

const root = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'src',
  'data',
  'library-explainer'
);

const MAX_FILE_BYTES = 100_000;
const MAX_TOTAL_BYTES = 400_000;

const read = (rel) => JSON.parse(readFileSync(join(root, rel), 'utf8'));
const schema = read('explainer.schema.json');

const ajv = new Ajv2020({ allErrors: true });
const validators = Object.fromEntries(
  ['manifest', 'subsets', 'systems', 'run'].map((name) => [
    name,
    ajv.compile({ $ref: `#/$defs/${name}`, $defs: schema.$defs }),
  ])
);

let failures = 0;
const fail = (message) => {
  failures += 1;
  console.error(`FAIL ${message}`);
};

const check = (name, obj, kind) => {
  if (!validators[kind](obj)) {
    fail(`${name}: ${ajv.errorsText(validators[kind].errors)}`);
  }
};

const manifest = read('manifest.json');
check('manifest.json', manifest, 'manifest');

const subsets = read('pipeline-subsets.json');
check('pipeline-subsets.json', subsets, 'subsets');

// Rows complete: 2^n rows, row k's enabled = the set bits of k, and every
// hazard edge runs forward across batches.
const n = subsets.transforms.length;
if (subsets.rows.length !== 2 ** n) {
  fail(`pipeline-subsets: ${subsets.rows.length} rows, expected ${2 ** n}`);
}
subsets.rows.forEach((row, mask) => {
  const expected = [...Array(n).keys()].filter((i) => (mask >> i) & 1);
  if (JSON.stringify(row.enabled) !== JSON.stringify(expected)) {
    fail(`pipeline-subsets row ${mask}: enabled ${row.enabled} != bits of ${mask}`);
  }
  const depth = new Map(row.batches.flatMap((batch, b) => batch.map((i) => [i, b])));
  for (const [i, j] of row.edges) {
    if (!(depth.get(i) < depth.get(j))) {
      fail(`pipeline-subsets row ${mask}: edge ${i}->${j} not forward across batches`);
    }
  }
});

const systems = read('system-graphs.json');
check('system-graphs.json', systems, 'systems');

for (const condition of manifest.conditions) {
  const rel = `runs/${manifest.env}.${condition}.json`;
  const run = read(rel);
  check(rel, run, 'run');
  if (Object.keys(run.node).length > 0) fail(`${rel}: node section must be empty`);
  for (const [name, arr] of Object.entries(run.global)) {
    if (arr.length !== manifest.T) {
      fail(`${rel}: global ${name} has length ${arr.length}, expected T=${manifest.T}`);
    }
  }
}

// Checksums + size gates over everything the manifest indexes.
let total = statSync(join(root, 'manifest.json')).size;
for (const [rel, digest] of Object.entries(manifest.checksums)) {
  const bytes = readFileSync(join(root, rel));
  const actual = createHash('sha256').update(bytes).digest('hex');
  if (actual !== digest) fail(`${rel}: sha256 mismatch (stale paste?)`);
  if (bytes.length > MAX_FILE_BYTES) {
    fail(`${rel}: ${bytes.length} B > ${MAX_FILE_BYTES} B gate`);
  }
  total += bytes.length;
}
if (total > MAX_TOTAL_BYTES) {
  fail(`fixture set totals ${total} B > ${MAX_TOTAL_BYTES} B gate`);
}

// Nothing undocumented in the data dir: every JSON file is either indexed by
// the manifest or one of the two roots (manifest, schema).
const indexed = new Set([
  'manifest.json',
  'explainer.schema.json',
  ...Object.keys(manifest.checksums),
]);
const walk = (dir, prefix = '') =>
  readdirSync(join(root, dir || '.'), { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? walk(join(dir, entry.name), `${prefix}${entry.name}/`)
      : [`${prefix}${entry.name}`]
  );
for (const rel of walk('')) {
  if (!indexed.has(rel)) fail(`${rel}: present but not indexed by the manifest`);
}

if (failures > 0) {
  console.error(`explainer fixtures: ${failures} failure(s)`);
  process.exit(1);
}
console.log(
  `explainer fixtures OK — env ${manifest.env}, T=${manifest.T}, ` +
    `${Object.keys(manifest.checksums).length} files, ${(total / 1e3).toFixed(0)} KB, ` +
    `engine ${manifest.engine.version} @ ${manifest.engine.git_rev}`
);
