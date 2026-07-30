import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const targetUrl = process.env.PLAYGROUND_URL || 'http://127.0.0.1:4321/lab/playground/';
const initialScenario = process.env.PLAYGROUND_SCENARIO || 'commons';
const chromeBin = process.env.CHROME_BIN || '/usr/bin/google-chrome';
const debugPort = 9333;
const profile = await mkdtemp(join(tmpdir(), 'eq-playground-chrome-'));

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
    `${targetUrl}#${initialScenario}`,
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
const browserEvents = [];
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === 'Runtime.exceptionThrown') {
    browserEvents.push(
      message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text
    );
  }
  if (message.method === 'Runtime.consoleAPICalled') {
    browserEvents.push(
      message.params.args.map((argument) => argument.value || argument.description).join(' ')
    );
  }
  if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') {
    browserEvents.push(message.params.entry.text);
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
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (await evaluate(expression)) return;
    await sleep(100);
  }
  const diagnostic = await evaluate(`({
    status: document.querySelector('.engine-status')?.textContent?.trim(),
    error: document.querySelector('.run-error')?.textContent?.trim()
  })`).catch(() => ({}));
  throw new Error(
    `${message}\nBrowser state: ${JSON.stringify(diagnostic)}\nEvents: ${browserEvents.join('\\n')}`
  );
}

try {
  await command('Runtime.enable');
  await command('Page.enable');
  await command('Log.enable');
  await waitFor(
    `location.hash === ${JSON.stringify(`#${initialScenario}`)} && Boolean(document.querySelector('.engine-status.ready'))`,
    'The worker-backed trajectory did not become ready.'
  );

  const initial = await evaluate(`({
    hash: location.hash,
    scenarios: document.querySelectorAll('.scenario-tabs button').length,
    scene: Boolean(document.querySelector('.showcase-scene')),
    sceneViewBox: document.querySelector('.showcase-scene')?.getAttribute('viewBox'),
    charts: Boolean(document.querySelector('.scenario-charts')),
    metrics: document.querySelectorAll('.metric-card').length,
    conditions: document.querySelectorAll('.condition-options button').length,
    stickyTitle: getComputedStyle(document.querySelector('.simulation-reader > .scenario-header')).position,
    titleWidth: document.querySelector('.simulation-reader > .scenario-header').getBoundingClientRect().width,
    readerWidth: document.querySelector('.simulation-reader').getBoundingClientRect().width,
    storyText: document.querySelector('.details-panel').textContent,
    navbar: Boolean(document.querySelector('body > header nav')),
    playgroundNav: [...document.querySelectorAll('body > header nav a')].some(
      (link) => link.textContent.trim() === 'Playground' && link.getAttribute('href') === '/lab/playground/'
    ),
    footer: Boolean(document.querySelector('footer')),
    status: document.querySelector('.engine-status').textContent.trim()
  })`);

  assert.equal(initial.hash, `#${initialScenario}`);
  assert.equal(initial.scenarios, 5);
  assert.equal(initial.scene, true);
  assert.equal(initial.sceneViewBox, '0 0 880 400');
  assert.equal(initial.charts, true);
  assert.equal(initial.metrics, 4);
  assert.ok(initial.conditions >= 3);
  assert.equal(initial.stickyTitle, 'sticky');
  assert.ok(Math.abs(initial.titleWidth - initial.readerWidth) < 1);
  assert.doesNotMatch(initial.storyText, /MODEL HEALTH|MODEL NOTE/);
  assert.equal(initial.navbar, true);
  assert.equal(initial.playgroundNav, true);
  assert.equal(initial.footer, true);

  await evaluate(`(() => {
    const header = document.querySelector('.simulation-reader > .scenario-header');
    window.scrollTo(0, header.getBoundingClientRect().top + window.scrollY + 240);
  })()`);
  await sleep(150);
  const stickyScroll = await evaluate(`(() => {
    const header = document.querySelector('.simulation-reader > .scenario-header');
    const headerRect = header.getBoundingClientRect();
    const topmost = document.elementFromPoint(headerRect.left + headerRect.width / 2, 12);
    return {
      headerTop: headerRect.top,
      headerOwnsPaint: Boolean(topmost?.closest('.simulation-reader > .scenario-header'))
    };
  })()`);
  assert.ok(
    Math.abs(stickyScroll.headerTop) < 2,
    `The scenario title must stick to the viewport top: ${JSON.stringify(stickyScroll)}`
  );
  assert.equal(
    stickyScroll.headerOwnsPaint,
    true,
    'The sticky scenario title must paint above scrolling simulation content.'
  );
  await evaluate('window.scrollTo(0, 0)');

  if (process.env.PLAYGROUND_SCREENSHOT) {
    const scrollTop = Number(process.env.PLAYGROUND_SCREENSHOT_SCROLL || 0);
    if (scrollTop > 0) {
      await evaluate(`window.scrollTo(0, ${scrollTop})`);
      await sleep(250);
    }
    const capture = await command('Page.captureScreenshot', { format: 'png' });
    await writeFile(process.env.PLAYGROUND_SCREENSHOT, Buffer.from(capture.data, 'base64'));
    if (scrollTop > 0) await evaluate('window.scrollTo(0, 0)');
  }

  await evaluate(`document.querySelectorAll('.scenario-tabs button')[3].click()`);
  await waitFor(
    `location.hash === '#political' && Boolean(document.querySelector('.engine-status.ready'))`,
    'The political scenario did not become ready.'
  );
  await evaluate(`(() => {
    const play = document.querySelector('.transport-button');
    if (play.getAttribute('aria-label') === 'Pause simulation') play.click();
    const scrub = document.querySelector('.transport input[type="range"]');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(scrub, '0');
    scrub.dispatchEvent(new Event('change', { bubbles: true }));
  })()`);
  await sleep(100);
  const politicalAtStart = await evaluate(
    `[...document.querySelectorAll('[data-metric]')].map((node) => node.textContent)`
  );
  await evaluate(`(() => {
    const scrub = document.querySelector('.transport input[type="range"]');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(scrub, '150');
    scrub.dispatchEvent(new Event('change', { bubbles: true }));
  })()`);
  await sleep(100);
  const politicalAt150 = await evaluate(
    `[...document.querySelectorAll('[data-metric]')].map((node) => node.textContent)`
  );
  assert.ok(
    politicalAt150.filter((value, index) => value !== politicalAtStart[index]).length >= 3,
    `Political metrics must be playhead-driven. t0=${politicalAtStart} t150=${politicalAt150}`
  );

  await evaluate(`document.querySelectorAll('.scenario-tabs button')[4].click()`);
  await waitFor(
    `location.hash === '#combined' && Boolean(document.querySelector('.engine-status.ready'))`,
    'The combined scenario did not become ready.'
  );
  assert.equal(
    await evaluate(
      `[...document.querySelectorAll('.showcase-scene *')].some((node) =>
        [...node.attributes].some((attribute) => attribute.value.includes('NaN'))
      )`
    ),
    false,
    'The combined SVG must not emit invalid numeric geometry.'
  );

  await evaluate(`document.querySelector('.settings-trigger').click()`);
  await waitFor(
    `Boolean(document.querySelector('.run-tools input'))`,
    'The settings panel did not open.'
  );
  const detailsMode = await evaluate(`({
    settingsInDetails: Boolean(document.querySelector('.details-panel > .details-settings')),
    storyVisible: Boolean(document.querySelector('.details-panel .story-beats')),
    modalBackdrop: Boolean(document.querySelector('.settings-backdrop')),
    scopeVisible: Boolean(document.querySelector('.details-panel .settings-scope')),
    playerToggle: document.querySelector('.settings-trigger').textContent.trim(),
    playerToggleLabel: document.querySelector('.settings-trigger').getAttribute('aria-label')
  })`);
  assert.equal(detailsMode.settingsInDetails, true);
  assert.equal(detailsMode.storyVisible, false);
  assert.equal(detailsMode.modalBackdrop, false);
  assert.equal(detailsMode.scopeVisible, true);
  assert.equal(detailsMode.playerToggle, 'Story');
  assert.equal(detailsMode.playerToggleLabel, 'Return to scenario story');
  await evaluate(`document.querySelector('.settings-trigger').click()`);
  await waitFor(
    `Boolean(document.querySelector('.details-panel .story-beats')) &&
      document.querySelector('.settings-trigger').textContent.trim() === 'Settings'`,
    'The player toggle did not return the details rail to the scenario story.'
  );
  await evaluate(`document.querySelector('.settings-trigger').click()`);
  await waitFor(
    `Boolean(document.querySelector('.run-tools input'))`,
    'The player toggle did not reopen model settings.'
  );
  const before = await evaluate(`document.querySelector('.run-tools input').value`);
  await evaluate(`(() => {
    const input = document.querySelector('.run-tools input');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, String(Number(input.value) + 1));
    input.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await waitFor(
    `document.querySelector('.run-tools input').value !== ${JSON.stringify(before)}`,
    'The seed control did not update.'
  );
  await waitFor(
    `Boolean(document.querySelector('.engine-status.running'))`,
    'The parameter change did not start a worker run.'
  );
  await waitFor(
    `Boolean(document.querySelector('.engine-status.ready'))`,
    'A parameter change did not recompute the trajectory.'
  );

  await evaluate(
    `[...document.querySelectorAll('.view-tabs button')].find((button) => button.textContent.trim().toLowerCase() === 'pipeline').click()`
  );
  assert.equal(
    await evaluate(
      `[...document.querySelectorAll('.view-tabs button')].find((button) => button.textContent.trim().toLowerCase() === 'pipeline').getAttribute('aria-selected')`
    ),
    'true'
  );

  await evaluate(`document.querySelector('.comparison-tools button').click()`);
  assert.ok(
    await evaluate(`document.querySelectorAll('.metric-delta').length === 4`),
    'Pinning A should annotate all four metrics.'
  );

  await command('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await command('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
  });
  await evaluate(`document.querySelectorAll('.scenario-tabs button')[1].click()`);
  await waitFor(
    `location.hash === '#economy' && Boolean(document.querySelector('.engine-status.ready'))`
  );

  const mobile = await evaluate(`({
    viewport: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    playLabel: document.querySelector('.transport-button').getAttribute('aria-label'),
    activeScenario: document.querySelector('.scenario-tabs button.active').textContent.trim(),
    ready: Boolean(document.querySelector('.engine-status.ready'))
  })`);

  assert.equal(mobile.viewport, 390);
  assert.ok(
    mobile.documentWidth <= mobile.viewport,
    'the mobile page must not overflow horizontally'
  );
  assert.equal(mobile.playLabel, 'Play simulation');
  assert.match(mobile.activeScenario, /Economy/);
  assert.equal(mobile.ready, true);

  console.log(
    JSON.stringify(
      {
        status: 'passed',
        url: targetUrl,
        desktop: { scenarios: initial.scenarios, metrics: initial.metrics, siteChrome: true },
        mobile,
      },
      null,
      2
    )
  );
} finally {
  socket.close();
  chrome.kill('SIGTERM');
  await new Promise((resolve) => chrome.once('exit', resolve));
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
