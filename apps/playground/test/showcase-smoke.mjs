// Browser smoke journey for /showcase, mirroring browser-smoke.mjs's CDP
// harness. Requires a served site build (default http://localhost:4321) and
// Chrome (CHROME_BIN to override the binary; SHOWCASE_URL for the page).
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const targetUrl = process.env.SHOWCASE_URL || 'http://localhost:4321/showcase/';
const chromeBin = process.env.CHROME_BIN || '/usr/bin/google-chrome';
const debugPort = 9339;
const profile = await mkdtemp(join(tmpdir(), 'eq-showcase-chrome-'));

const chrome = spawn(
  chromeBin,
  [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-breakpad',
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profile}`,
    '--window-size=1440,1000',
    targetUrl,
  ],
  { stdio: ['ignore', 'ignore', 'pipe'] }
);

let chromeErrors = '';
chrome.stderr.on('data', (chunk) => {
  chromeErrors += chunk;
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function pageTarget() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${debugPort}/json/list`).then((response) =>
        response.json()
      );
      const page = targets.find((target) => target.type === 'page');
      if (page?.webSocketDebuggerUrl) return page;
    } catch {
      // Chrome has not opened its debugging endpoint yet.
    }
    await sleep(100);
  }
  throw new Error(`Chrome did not expose a page target.\n${chromeErrors}`);
}

const page = await pageTarget();
const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let nextId = 0;
const pending = new Map();
const browserErrors = [];
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === 'Runtime.exceptionThrown') {
    browserErrors.push(
      message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text
    );
  }
  if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') {
    browserErrors.push(message.params.entry.text);
  }
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

function command(method, params = {}) {
  const id = ++nextId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await command('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || 'Browser evaluation failed.');
  }
  return result.result.value;
}

async function waitFor(expression, message) {
  for (let attempt = 0; attempt < 150; attempt += 1) {
    if (await evaluate(expression)) return;
    await sleep(100);
  }
  throw new Error(`${message}\nErrors: ${browserErrors.join('\n')}`);
}

const stage = (index) => `document.querySelectorAll('.showcase-stage')[${index}]`;

try {
  await command('Runtime.enable');
  await command('Page.enable');
  await command('Log.enable');

  await waitFor(
    `document.querySelectorAll('.showcase-chapter').length === 7`,
    'The showcase island did not mount seven chapters.'
  );

  const structure = await evaluate(`({
    noindex: document.querySelector('meta[name="robots"]')?.content,
    stages: document.querySelectorAll('.showcase-stage').length,
    blocks: document.querySelectorAll('.assumption-block').length,
    substack: Boolean(document.querySelector('a[href*="equilibria1.substack.com"]')),
    trays: document.querySelectorAll('.details-panel, .condition-bar, .parameter-group').length,
  })`);
  assert.equal(structure.noindex, 'noindex, nofollow', 'page must be noindex');
  assert.equal(structure.stages, 5, 'four model stages plus the playable stage');
  assert.ok(structure.blocks >= 3, 'assumption blocks render');
  assert.ok(structure.substack, 'the opener links the argument post');
  assert.equal(structure.trays, 0, 'no workbench chrome may leak into the showcase');

  // Every stage lazy-runs when scrolled into view.
  for (let index = 0; index < 5; index += 1) {
    await evaluate(`${stage(index)}.scrollIntoView({ block: 'center' })`);
    await waitFor(
      `Boolean(${stage(index)}.querySelector('.showcase-scene'))`,
      `Stage ${index} never rendered its scene.`
    );
  }

  // Autoplay advances, and the network scene carries packet traffic: the
  // dynamic layer redraws rects (packets, AI fills) every frame — during
  // playback their count sits well above the static baseline of one legend
  // rect.
  await evaluate(`${stage(0)}.scrollIntoView({ block: 'center' })`);
  await evaluate(`${stage(0)}.querySelector('.beat-list button').click()`);
  await waitFor(
    `Boolean(${stage(0)}.querySelector('.showcase-scene'))`,
    'Coupled stage lost its scene after restaging.'
  );
  const tickBefore = await evaluate(`${stage(0)}.querySelector('.tick-readout').textContent`);
  await sleep(900);
  const tickAfter = await evaluate(`${stage(0)}.querySelector('.tick-readout').textContent`);
  assert.notEqual(tickBefore, tickAfter, 'autoplay must advance the playhead');
  const rects = await evaluate(`${stage(0)}.querySelectorAll('.showcase-scene rect').length`);
  assert.ok(rects > 12, `packet traffic missing: only ${rects} rects in the coupled scene`);

  // Beat stepping restages with the beat's preset.
  await evaluate(`${stage(1)}.scrollIntoView({ block: 'center' })`);
  await waitFor(
    `Boolean(${stage(1)}.querySelector('.showcase-scene'))`,
    'Economy stage never rendered.'
  );
  await evaluate(`${stage(1)}.querySelector('.showcase-next').click()`);
  await waitFor(
    `${stage(1)}.querySelector('.beat-list li.active strong').textContent === 'Above the threshold'`,
    'Next did not advance the economy chapter.'
  );

  // The playable stage: chips and dials re-run the model. Compare the
  // headline metric at a fixed late tick between sealed and collapse — the
  // outcome, not in-flight state.
  const lite = `document.querySelector('.lite-stage')`;
  await evaluate(`${lite}.scrollIntoView({ block: 'center' })`);
  await waitFor(
    `Boolean(${lite}.querySelector('.showcase-scene'))`,
    'The playable stage never ran.'
  );
  const metricAtEnd = async () => {
    await evaluate(`(() => {
      const input = ${lite}.querySelector('.showcase-transport input[type="range"]');
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(input, input.max);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    })()`);
    await sleep(150);
    return evaluate(`${lite}.querySelector('.showcase-metric strong').textContent`);
  };
  const sealedMetric = await metricAtEnd();
  await evaluate(
    `[...${lite}.querySelectorAll('.lite-chips button')].find((b) => b.textContent.includes('Everything gives way')).click()`
  );
  await waitFor(
    `[...${lite}.querySelectorAll('.lite-chips button')].find((b) => b.textContent.includes('Everything gives way'))?.getAttribute('aria-pressed') === 'true'`,
    'Collapse chip did not activate.'
  );
  await sleep(600);
  await waitFor(
    `Boolean(${lite}.querySelector('.showcase-scene'))`,
    'The playable stage did not re-run after the chip.'
  );
  const collapseMetric = await metricAtEnd();
  assert.notEqual(sealedMetric, collapseMetric, 'chip change must change the outcome');

  // A dial move re-runs too: drag one slider to its max and expect a fresh
  // ready state.
  await evaluate(`(() => {
    const input = ${lite}.querySelector('.lite-dial input[type="range"]');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, input.max);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  })()`);
  await waitFor(
    `[...${lite}.querySelectorAll('.lite-chips button')].every((b) => b.getAttribute('aria-pressed') !== 'true')`,
    'Moving a dial must deselect the active chip.'
  );
  await sleep(600);
  await waitFor(
    `Boolean(${lite}.querySelector('.showcase-scene'))`,
    'The playable stage did not re-run after the dial move.'
  );

  const handoff = await evaluate(
    `[...document.querySelectorAll('.showcase-link-card')].map((a) => a.getAttribute('href'))`
  );
  assert.ok(handoff.includes('/playground/#combined'), 'the ending must deep-link the playground');

  assert.deepEqual(browserErrors, [], 'the journey must not log browser errors');
  console.log(JSON.stringify({ status: 'passed', url: targetUrl, structure }, null, 2));
} finally {
  socket.close();
  chrome.kill();
  await sleep(300);
  await rm(profile, { recursive: true, force: true }).catch(() => {});
}
