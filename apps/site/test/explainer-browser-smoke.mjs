import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const targetUrl = process.env.EXPLAINER_URL || 'http://127.0.0.1:4321/thesis/';
const chromeBin = process.env.CHROME_BIN || '/usr/bin/google-chrome';
const screenshotDir = process.env.EXPLAINER_SCREENSHOT_DIR;
const debugPort = 9341;
const profile = await mkdtemp(join(tmpdir(), 'eq-explainer-chrome-'));
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
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${debugPort}/json/list`).then((response) =>
        response.json()
      );
      const page = targets.find((target) => target.type === 'page');
      if (page?.webSocketDebuggerUrl) return page;
    } catch {
      // Chrome has not exposed its debugging target yet.
    }
    await sleep(100);
  }
  throw new Error(`Chrome did not expose the explainer page.\n${chromeErrors}`);
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
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (await evaluate(expression)) return;
    await sleep(100);
  }
  throw new Error(`${message}\nBrowser errors: ${browserErrors.join('\n')}`);
}

const scenes = [
  {
    scene: 'society',
    anchors: [
      'one interdependent social fabric',
      'relations carry: resources · decisions · information',
      'G = (V, E)',
      'V = actors ; E = relationships',
    ],
  },
  {
    scene: 'defection',
    anchors: [
      'local payoff ↑',
      'collective welfare ↓',
      'uᵢ(D, s₋ᵢ) > uᵢ(C, s₋ᵢ)',
      'defection pays more, given everyone else',
    ],
  },
  {
    scene: 'equilibria',
    anchors: [
      'E₁ / better for all',
      'E₂ / stable but worse',
      'no agent can move first',
      's* ∈ NE ∧ W(s*) < W(ŝ)',
      'stable can still be worse for everyone',
    ],
  },
  {
    scene: 'uncertainty',
    anchors: [
      'Which future becomes stable?',
      'P(Gₜ₊₁ | Gₜ, π) = ?',
      'the next network state remains unresolved',
    ],
  },
  {
    scene: 'knowledge',
    anchors: [
      'ONE QUESTION',
      'Cooperative AI',
      'Comp. Social Science',
      'Agent Foundations',
      'Complex Systems',
      'M = {m_CAI, m_CSS, m_AF, m_CS}',
      'four named model families / one problem',
    ],
  },
  {
    scene: 'silos',
    anchors: [
      'four subnetworks / no translation layer',
      'translation gap',
      '|E_between| ≪ |E_within|',
      'knowledge exists; translation edges are sparse',
    ],
  },
  {
    scene: 'bridge',
    anchors: [
      'connections no field finds alone',
      'coherent governance',
      'eq ∈ V ; E_bridge ⊂ V × V',
      'one participant helps a distributed mesh connect',
    ],
  },
];

try {
  await command('Runtime.enable');
  await command('Page.enable');
  await command('Log.enable');
  await waitFor(
    `document.querySelectorAll('[data-step-index]').length === 7 &&
      Boolean(document.querySelector('[data-scene="society"]')) &&
      !document.querySelector('[data-scene="society"]').closest('astro-island')?.hasAttribute('ssr')`,
    'The seven-state notebook thesis did not hydrate.'
  );

  if (screenshotDir) await mkdir(screenshotDir, { recursive: true });
  const observations = [];
  for (let index = 0; index < scenes.length; index += 1) {
    const { scene, anchors } = scenes[index];
    await evaluate(
      `document.querySelector('#step-${index + 1}').scrollIntoView({ behavior: 'auto', block: 'start' })`
    );
    await waitFor(
      `Boolean(document.querySelector('[data-scene="${scene}"]'))`,
      `The ${scene} state did not become active.`
    );
    await sleep(850);
    const observation = await evaluate(`(() => {
      const root = document.querySelector('[data-scene="${scene}"]');
      const svg = root.querySelector('svg[role="img"]');
      const strokes = [...root.querySelectorAll('[role="button"] > path:first-child')]
        .map((node) => getComputedStyle(node).stroke);
      const fills = [...root.querySelectorAll('[role="button"] > path:first-child')]
        .map((node) => getComputedStyle(node).fill);
      const payoffPath = root.querySelector('[data-annotation="local-payoff"]');
      const connectionLegend = svg.querySelector('[data-legend="connection-pattern"]');
      const connectorGrammar = root.dataset.connectorGrammar;
      const connectionPatterns = [...root.querySelectorAll('[data-legend="connection-pattern"] path')]
        .map((path) => getComputedStyle(path).strokeDasharray);
      return {
        scene: root.dataset.scene,
        connectorGrammar,
        text: svg.textContent.replace(/\\s+/g, ' ').trim(),
        svgLabel: svg.getAttribute('aria-label'),
        title: svg.querySelector('title')?.textContent,
        description: svg.querySelector('desc')?.textContent,
        controls: root.querySelectorAll('[role="button"]').length,
        keyboardControls: root.querySelectorAll('[role="button"][tabindex="0"]').length,
        uniqueNodeStrokes: [...new Set(strokes)].length,
        uniqueNodeFills: [...new Set(fills)].length,
        shapeLegend: Boolean(svg.querySelector('[data-legend="actor-type"]')),
        strategicLegend: Boolean(svg.querySelector('[data-legend="strategic-state"]')),
        connectionLegend: Boolean(connectionLegend),
        connectionPatterns: [...new Set(connectionPatterns)],
        payoffConnectorIsCubic: payoffPath?.getAttribute('d')?.includes('C') ?? null,
        payoffConnectorLength: payoffPath?.getTotalLength() ?? null
      };
    })()`);
    assert.equal(observation.scene, scene);
    anchors.forEach((anchor) =>
      assert.ok(observation.text.includes(anchor), `${scene}: ${anchor}`)
    );
    assert.ok(observation.svgLabel);
    assert.ok(observation.title);
    assert.ok(observation.description);
    assert.equal(observation.controls, 20);
    assert.equal(observation.keyboardControls, 20);
    assert.equal(observation.shapeLegend, true);
    assert.equal(observation.connectionLegend, observation.connectorGrammar === 'notebook-v1');
    if (observation.connectorGrammar === 'notebook-v1') {
      assert.ok(observation.connectionPatterns.length >= 2);
    }
    assert.ok(observation.uniqueNodeFills >= 3);
    assert.equal(observation.strategicLegend, index >= 1 && index <= 3);
    if (observation.strategicLegend) {
      assert.ok(observation.text.includes('cooperate'));
      assert.ok(observation.text.includes('defect'));
    }
    if (scene === 'uncertainty') assert.ok(observation.text.includes('unresolved'));
    assert.ok(observation.text.includes('human / open'));
    assert.ok(observation.text.includes('AI agent / light hatch'));
    assert.ok(observation.text.includes('institution / cross-hatch'));
    if (scene === 'defection') {
      assert.equal(observation.payoffConnectorIsCubic, true);
      assert.ok(observation.payoffConnectorLength < 180);
    }
    if (index > 0) assert.ok(observation.uniqueNodeStrokes >= 2);
    observations.push(observation);

    if (index === 0) {
      const nodeCenter = await evaluate(`(() => {
        const bounds = document
          .querySelector('[data-scene="society"] [role="button"]')
          .getBoundingClientRect();
        return { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
      })()`);
      await command('Input.dispatchMouseEvent', {
        type: 'mousePressed',
        x: nodeCenter.x,
        y: nodeCenter.y,
        button: 'left',
        clickCount: 1,
      });
      await command('Input.dispatchMouseEvent', {
        type: 'mouseReleased',
        x: nodeCenter.x,
        y: nodeCenter.y,
        button: 'left',
        clickCount: 1,
      });
      await sleep(50);
      const selection = await evaluate(`(() => {
        const firstNode = document.querySelector('[data-scene="society"] [role="button"]');
        return {
          pressed: firstNode.getAttribute('aria-pressed'),
          selectionText: document.querySelector('[data-scene="society"] svg').textContent
        };
      })()`);
      assert.equal(selection.pressed, 'true');
      assert.ok(selection.selectionText.includes('select again to release'));
      await command('Input.dispatchMouseEvent', {
        type: 'mousePressed',
        x: nodeCenter.x,
        y: nodeCenter.y,
        button: 'left',
        clickCount: 1,
      });
      await command('Input.dispatchMouseEvent', {
        type: 'mouseReleased',
        x: nodeCenter.x,
        y: nodeCenter.y,
        button: 'left',
        clickCount: 1,
      });
    }

    if (screenshotDir) {
      const capture = await command('Page.captureScreenshot', { format: 'png' });
      await writeFile(
        join(screenshotDir, `step-${index + 1}-${scene}.png`),
        Buffer.from(capture.data, 'base64')
      );
    }
  }

  await command('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await evaluate(`window.__thesisSmokeReloadMarker = 'pending'`);
  await command('Page.reload', { ignoreCache: true });
  await waitFor(
    `window.__thesisSmokeReloadMarker !== 'pending' &&
      Boolean(document.querySelector('[data-scene]')) &&
      !document.querySelector('[data-scene]').closest('astro-island')?.hasAttribute('ssr')`,
    'The mobile thesis did not hydrate.'
  );
  await evaluate(
    `document.querySelector('#step-1').scrollIntoView({ behavior: 'auto', block: 'center' })`
  );
  await waitFor(
    `Boolean(document.querySelector('[data-scene="society"]'))`,
    'The mobile society state did not become active.'
  );
  await evaluate(
    `document.querySelector('#step-7').scrollIntoView({ behavior: 'auto', block: 'center' })`
  );
  await evaluate(`window.scrollBy({ top: 64, behavior: 'auto' })`);
  await waitFor(
    `Boolean(document.querySelector('[data-scene="bridge"]'))`,
    'The mobile bridge state did not become active.'
  );
  const mobile = await evaluate(`({
    viewport: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    scene: document.querySelector('[data-scene]')?.dataset.scene,
    svgVisible: document.querySelector('[data-scene] svg').getBoundingClientRect().height > 0
  })`);
  assert.equal(mobile.viewport, 390);
  assert.equal(mobile.documentWidth, 390);
  assert.equal(mobile.scene, 'bridge');
  assert.equal(mobile.svgVisible, true);
  if (screenshotDir) {
    const capture = await command('Page.captureScreenshot', { format: 'png' });
    await writeFile(
      join(screenshotDir, 'mobile-step-7-bridge.png'),
      Buffer.from(capture.data, 'base64')
    );
  }
  assert.deepEqual(browserErrors, []);

  process.stdout.write(
    `${JSON.stringify({ status: 'passed', url: targetUrl, scenes: observations.length, mobile }, null, 2)}\n`
  );
} finally {
  socket.close();
  chrome.kill('SIGTERM');
  await sleep(250);
  await rm(profile, { recursive: true, force: true, maxRetries: 4, retryDelay: 100 }).catch(
    () => {}
  );
}
