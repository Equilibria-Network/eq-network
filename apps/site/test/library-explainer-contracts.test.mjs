import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { librarySegments } from '../src/components/library-explainer/script.ts';
import {
  scheduleFires,
  scheduleWindow,
} from '../src/components/library-explainer/schedulePredicate.ts';

const site = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(site, 'src', 'data', 'library-explainer');
const componentsDir = join(site, 'src', 'components', 'library-explainer');
const read = (rel) => JSON.parse(readFileSync(join(dataDir, rel), 'utf8'));

const subsets = read('pipeline-subsets.json');
const systems = read('system-graphs.json');
const snippets = read('snippets.json');
const golden = read('schedule-golden.json');
const graphMatrixFixture = read('graph-matrix.json');

test('the flow walks the planned segments and every stage resolves to fixture data', () => {
  assert.deepEqual(
    librarySegments.map((segment) => segment.id),
    ['object', 'step', 'compiler', 'category', 'matrix', 'spectral']
  );

  const transformNames = new Set(subsets.transforms.map((t) => t.name));
  for (const segment of librarySegments) {
    for (const step of segment.steps) {
      assert.ok(step.headline.length > 0 && step.body.length > 0, step.id);
      if (step.snippetId) {
        assert.ok(snippets[step.snippetId], `${step.id}: unknown snippet ${step.snippetId}`);
      }
      const stage = step.stage;
      if (stage.kind === 'transform-card') {
        for (const name of stage.transforms) {
          assert.ok(transformNames.has(name), `${step.id}: unknown transform ${name}`);
        }
      } else if (stage.kind === 'batches') {
        const mask = stage.enabled.reduce((m, i) => m | (1 << i), 0);
        const row = subsets.rows[mask];
        assert.ok(row, `${step.id}: no subset row for ${stage.enabled}`);
        assert.deepEqual(row.enabled, stage.enabled, step.id);
      } else if (stage.kind === 'system') {
        assert.ok(
          systems.conditions[stage.condition],
          `${step.id}: no system graph for ${stage.condition}`
        );
      } else if (stage.kind === 'schedule') {
        assert.ok(stage.cadence >= 1, step.id);
      } else if (stage.kind === 'category') {
        assert.ok(['endo', 'factor', 'interchange', 'tick'].includes(stage.view), step.id);
        // The diagrams' commutation claim, held to the fixture: transforms
        // the compiler put in the same batch must have no hazard edge.
        const full = subsets.rows[0b1111];
        for (const batch of full.batches) {
          for (const i of batch) {
            for (const j of batch) {
              assert.ok(
                !full.edges.some(([a, b]) => (a === i && b === j) || (a === j && b === i)),
                `${step.id}: batch-mates ${i},${j} conflict`
              );
            }
          }
        }
      } else if (stage.kind === 'matrix' || stage.kind === 'spectral') {
        assert.equal(graphMatrixFixture.adj.length, graphMatrixFixture.N ** 2, step.id);
        assert.equal(graphMatrixFixture.spectral.fiedler.length, graphMatrixFixture.N, step.id);
      }
    }
  }
});

test('the schedule widget reproduces the engine golden exactly', () => {
  // The golden was probed through the engine's own scheduled() wrapper; the
  // page predicate must match it tick for tick, combo for combo.
  for (const combo of golden.combos) {
    const window = scheduleWindow(golden.ticks, combo.cadence, combo.phase_offset, combo.onset);
    assert.deepEqual(
      window,
      combo.fires,
      `(cadence=${combo.cadence}, phase_offset=${combo.phase_offset}, onset=${combo.onset})`
    );
  }
});

test('the schedule widget mirrors the engine predicate semantics', () => {
  // Semantic properties of scheduled() (core/schedule.py): fires only from
  // onset, only on the cadence lattice shifted by phase_offset, with
  // Python's mod semantics. The golden fixture pins this bit-for-bit in a
  // later phase; these are the invariants that must already hold.
  for (const [cadence, phase, onset] of [
    [1, 0, 0],
    [5, 0, 0],
    [5, 2, 0],
    [5, 0, 12],
    [7, 3, 20],
  ]) {
    const window = scheduleWindow(60, cadence, phase, onset);
    window.forEach((fires, t) => {
      if (fires) {
        assert.ok(t >= onset, `t=${t} fired before onset ${onset}`);
        assert.equal(
          (((t - phase) % cadence) + cadence) % cadence,
          0,
          `t=${t} off the cadence lattice`
        );
      }
    });
    const expected = Math.max(
      0,
      Math.floor((60 - 1 - firstFire(cadence, phase, onset)) / cadence) + 1
    );
    const actual = window.filter(Boolean).length;
    assert.equal(actual, expected, `count for (${cadence}, ${phase}, ${onset})`);
  }
  assert.equal(scheduleFires(0, 5, 2, 0), false);
  assert.equal(scheduleFires(2, 5, 2, 0), true);
});

function firstFire(cadence, phase, onset) {
  let t = onset;
  while ((((t - phase) % cadence) + cadence) % cadence !== 0) t += 1;
  return t;
}

test('purity guard: the explainer imports no playground code and no kernel', () => {
  const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]
    );
  for (const file of walk(componentsDir)) {
    const source = readFileSync(file, 'utf8');
    assert.ok(!source.includes('@eq-network/playground'), `${file} imports the playground package`);
    assert.ok(!/kernel/i.test(source), `${file} mentions kernel`);
  }
});
