import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const targetUrl = process.env.PLAYGROUND_URL || 'http://127.0.0.1:4321/playground/';
const initialScenario = process.env.PLAYGROUND_SCENARIO || 'combined';
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
    heroMeta: Boolean(document.querySelector('.pageHeader .aside')),
    heroTitleLines: (() => {
      const node = document.querySelector('.pageHeader h1');
      const style = getComputedStyle(node);
      return Math.round(node.getBoundingClientRect().height / Number.parseFloat(style.lineHeight));
    })(),
    heroSummary: document.querySelector('.pageHeader .summary')?.textContent.trim(),
    scenarios: document.querySelectorAll('.scenario-toggle').length,
    scene: Boolean(document.querySelector('.showcase-scene')),
    sceneViewBox: document.querySelector('.showcase-scene')?.getAttribute('viewBox'),
    charts: Boolean(document.querySelector('.scenario-charts')),
    metrics: document.querySelectorAll('.metric-card').length,
    conditions: document.querySelectorAll('.condition-options button').length,
    stickyTitle: getComputedStyle(document.querySelector('.simulation-reader > .scenario-header')).position,
    headerMatchesReaderChild: document.querySelector('.scenario-header').matches(
      '.simulation-reader > .scenario-header'
    ),
    headerParentClass: document.querySelector('.scenario-header').parentElement.className,
    titleWidth: document.querySelector('.simulation-reader > .scenario-header').getBoundingClientRect().width,
    readerWidth: document.querySelector('.simulation-reader').getBoundingClientRect().width,
    storyText: document.querySelector('.scenario-tabs').textContent,
    settingsHidden: !document.querySelector('.details-panel'),
    railWidth: document.querySelector('.scenario-tabs').getBoundingClientRect().width,
    railBackground: getComputedStyle(document.querySelector('.scenario-tabs')).backgroundColor,
    railHatch: getComputedStyle(document.querySelector('.scenario-tabs'), '::before').backgroundImage,
    railScrollbar: getComputedStyle(document.querySelector('.scenario-tabs')).scrollbarWidth,
    headerDivider: getComputedStyle(
      document.querySelector('.simulation-reader > .scenario-header')
    ).borderBottomWidth,
    railHeadingSize: Number.parseFloat(
      getComputedStyle(document.querySelector('.rail-heading strong')).fontSize
    ),
    railHeading: document.querySelector('.rail-heading strong').textContent.trim(),
    storyDescriptionSize: Number.parseFloat(
      getComputedStyle(document.querySelector('.scenario-story > p')).fontSize
    ),
    storyStepSize: Number.parseFloat(
      getComputedStyle(document.querySelector('.scenario-story button strong')).fontSize
    ),
    navbar: Boolean(document.querySelector('body > header nav')),
    playgroundNav: [...document.querySelectorAll('body > header nav a')].some(
      (link) => link.textContent.trim() === 'Playground' && link.getAttribute('href') === '/playground/'
    ),
    footer: Boolean(document.querySelector('footer')),
    status: document.querySelector('.engine-status').textContent.trim(),
    headerShadow: getComputedStyle(
      document.querySelector('.simulation-reader > .scenario-header')
    ).boxShadow,
    flatControls: [
      ...document.querySelectorAll(
        '.scenario-toggle, .scenario-story button, .view-tabs button, .condition-options button, .metric-card'
      )
    ].every((node) => {
      const style = getComputedStyle(node);
      return style.boxShadow === 'none' && style.borderRadius === '0px';
    }),
    selectedControlTabs: [
      ...document.querySelectorAll(
        '.view-tabs button.active, .condition-options button.active'
      )
    ].every((node) => {
      const style = getComputedStyle(node);
      return style.backgroundColor === 'rgb(0, 59, 126)' && style.color === 'rgb(255, 255, 255)';
    }),
    selectedScenario: (() => {
      const node = document.querySelector('.scenario-list > li.active > .scenario-toggle');
      const label = node.querySelector('strong');
      const style = getComputedStyle(node);
      const labelStyle = getComputedStyle(label);
      return {
        background: style.backgroundColor,
        color: style.color,
        weight: Number.parseInt(labelStyle.fontWeight, 10),
        decoration: labelStyle.textDecorationLine,
        decorationColor: labelStyle.textDecorationColor
      };
    })(),
    selectedStory: (() => {
      const node = document.querySelector('.scenario-story li.active > button');
      const label = node.querySelector('strong');
      const style = getComputedStyle(node);
      const labelStyle = getComputedStyle(label);
      return {
        background: style.backgroundColor,
        color: style.color,
        weight: Number.parseInt(labelStyle.fontWeight, 10),
        decoration: labelStyle.textDecorationLine,
        decorationColor: labelStyle.textDecorationColor
      };
    })(),
    hatchedTabCues: [
      ...document.querySelectorAll(
        '.scenario-toggle, .scenario-story button, .view-tabs button, .condition-options button, .settings-trigger, .toggle-control'
      )
    ].some((node) => {
      const style = getComputedStyle(node);
      const after = getComputedStyle(node, '::after');
      return style.backgroundImage.includes('gradient') || after.backgroundImage.includes('gradient');
    }),
    leftDividerImage: getComputedStyle(
      document.querySelector('.rail-resizer-left'),
      '::after'
    ).backgroundImage,
    leftResizer: Boolean(document.querySelector('.rail-resizer-left[role="separator"]')),
    leftResizeValue: document.querySelector('.rail-resizer-left')?.getAttribute('aria-valuenow')
  })`);

  assert.equal(initial.hash, `#${initialScenario}`);
  assert.equal(initial.heroMeta, false);
  assert.ok(initial.heroTitleLines <= 2);
  assert.match(initial.heroSummary, /^Usually coordination systems are tested in the real world/);
  assert.equal(initial.scenarios, 4);
  assert.equal(initial.scene, true);
  assert.equal(initial.sceneViewBox, '0 0 880 400');
  assert.equal(initial.charts, true);
  assert.equal(initial.metrics, 4);
  assert.ok(initial.conditions >= 3);
  assert.equal(
    initial.stickyTitle,
    'sticky',
    `The scenario title must use the sticky reader header rule: ${JSON.stringify({
      matches: initial.headerMatchesReaderChild,
      parent: initial.headerParentClass,
    })}`
  );
  assert.ok(Math.abs(initial.titleWidth - initial.readerWidth) < 1);
  assert.doesNotMatch(initial.storyText, /MODEL HEALTH|MODEL NOTE/);
  assert.equal(initial.navbar, true);
  assert.equal(initial.playgroundNav, true);
  assert.equal(initial.footer, true);
  assert.equal(initial.settingsHidden, true);
  assert.equal(initial.railWidth, 480);
  assert.equal(initial.railBackground, 'rgb(247, 248, 250)');
  assert.equal(initial.railHatch, 'none');
  assert.equal(initial.railScrollbar, 'none');
  assert.equal(initial.headerDivider, '1px');
  assert.ok(initial.railHeadingSize >= 20);
  assert.equal(initial.railHeading, 'Scenario Guide');
  assert.ok(initial.storyDescriptionSize >= 13);
  assert.ok(initial.storyStepSize >= 14);
  assert.equal(initial.headerShadow, 'none');
  assert.equal(initial.flatControls, true);
  assert.equal(initial.selectedControlTabs, true);
  assert.equal(initial.selectedScenario.background, 'rgba(0, 0, 0, 0)');
  assert.equal(initial.selectedScenario.color, 'rgb(0, 59, 126)');
  assert.ok(initial.selectedScenario.weight >= 700);
  assert.equal(initial.selectedScenario.decoration, 'underline');
  assert.equal(initial.selectedScenario.decorationColor, 'rgb(74, 179, 244)');
  assert.equal(initial.selectedStory.background, 'rgba(0, 0, 0, 0)');
  assert.equal(initial.selectedStory.color, 'rgb(0, 59, 126)');
  assert.ok(initial.selectedStory.weight >= 700);
  assert.equal(initial.selectedStory.decoration, 'underline');
  assert.equal(initial.selectedStory.decorationColor, 'rgb(74, 179, 244)');
  assert.equal(initial.hatchedTabCues, false);
  assert.equal(initial.leftDividerImage, 'none');
  assert.equal(initial.leftResizer, true);
  assert.equal(initial.leftResizeValue, '480');

  await evaluate(`document.querySelector('.rail-resizer-left').focus()`);
  await evaluate(
    `document.querySelector('.rail-resizer-left').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))`
  );
  await waitFor(
    `Number(document.querySelector('.rail-resizer-left').getAttribute('aria-valuenow')) === 464`,
    'The scenario rail did not respond to keyboard resizing.'
  );
  await evaluate(
    `document.querySelector('.simulation-reader').scrollIntoView({ block: 'start', behavior: 'instant' })`
  );
  await sleep(100);
  const leftHandle = await evaluate(`(() => {
    const rect = document.querySelector('.rail-resizer-left').getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  })()`);
  await command('Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x: leftHandle.x,
    y: leftHandle.y,
    button: 'left',
    clickCount: 1,
  });
  await command('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: leftHandle.x + 24,
    y: leftHandle.y,
    button: 'left',
    buttons: 1,
  });
  await command('Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x: leftHandle.x + 24,
    y: leftHandle.y,
    button: 'left',
    clickCount: 1,
  });
  await waitFor(
    `Number(document.querySelector('.rail-resizer-left').getAttribute('aria-valuenow')) === 480`,
    'The scenario rail did not respond to pointer dragging.'
  );

  await evaluate(`document.querySelector('.scenario-story ol li:nth-child(4) > button').click()`);
  await waitFor(
    `document.querySelector('.scenario-story ol li:nth-child(4) > button').getAttribute('aria-current') === 'step' &&
      document.querySelector('.view-tabs button[aria-selected="true"]').textContent.trim() === 'System' &&
      Number(document.querySelector('.transport input[type="range"]').value) > 0`,
    'The coupled story did not drive its view and playback.'
  );
  assert.equal(
    await evaluate(
      `[...document.querySelectorAll('.condition-options button')].find((button) => button.textContent.trim() === 'People lobby too').getAttribute('aria-pressed')`
    ),
    'true',
    'A story step must activate its authored scenario condition.'
  );

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
  const fittedReader = await evaluate(`({
    viewportBottom: innerHeight,
    chartsBottom: document.querySelector('.scenario-charts').getBoundingClientRect().bottom,
    headerHeight: document.querySelector('.simulation-reader > .scenario-header').getBoundingClientRect().height
  })`);
  assert.ok(
    fittedReader.headerHeight <= 54,
    `The compact sticky title must stay at or below 54 px: ${JSON.stringify(fittedReader)}`
  );
  assert.ok(
    fittedReader.chartsBottom <= fittedReader.viewportBottom + 2,
    `The simulation and charts must fit in one snapped viewport: ${JSON.stringify(fittedReader)}`
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

  await evaluate(`document.querySelectorAll('.scenario-toggle')[2].click()`);
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

  await evaluate(`document.querySelectorAll('.scenario-toggle')[0].click()`);
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

  await evaluate(
    `document.querySelector('.settings-trigger[aria-label="Open model settings"]').click()`
  );
  await waitFor(
    `Boolean(document.querySelector('.run-tools input'))`,
    'The settings panel did not open.'
  );
  const detailsMode = await evaluate(`({
    settingsInDetails: Boolean(document.querySelector('.details-panel > .details-settings')),
    storyInLeftRail: Boolean(document.querySelector('.scenario-story')),
    modalBackdrop: Boolean(document.querySelector('.settings-backdrop')),
    // Structural, not textual: these used to assert on literal sentences from
    // one scenario's copy, so rewording the page broke the smoke test. Matched
    // case-insensitively because the headings are uppercased by CSS, and
    // textContent reports the DOM's own casing.
    evidenceVisible: /evidence anchor/i.test(document.querySelector('.details-panel').textContent),
    assumptionsVisible: /modelling assumptions/i.test(document.querySelector('.details-panel').textContent),
    shareRun: document.querySelector('.details-panel').textContent.includes('Share run'),
    settingsPressed: document.querySelector('.settings-trigger[aria-label="Open model settings"]').getAttribute('aria-pressed'),
    panelShadow: getComputedStyle(document.querySelector('.details-panel')).boxShadow,
    flatSettings: [
      ...document.querySelectorAll(
        '.details-settings .parameter-group, .details-settings .comparison-tools, .configuration-notes section, .details-settings button, .details-settings input'
      )
    ].every((node) => {
      const style = getComputedStyle(node);
      return style.boxShadow === 'none' && style.borderRadius === '0px';
    }),
    whiteSettings: [
      ...document.querySelectorAll(
        '.details-panel, .details-settings, .details-settings .control-heading, .details-settings .parameter-group, .details-settings .parameter-group legend, .details-settings .parameter, .details-settings .run-tools, .details-settings .comparison-tools, .configuration-notes, .configuration-notes section'
      )
    ].every((node) => getComputedStyle(node).backgroundColor === 'rgb(255, 255, 255)'),
    rightResizer: Boolean(document.querySelector('.rail-resizer-right[role="separator"]')),
    rightResizeValue: document.querySelector('.rail-resizer-right')?.getAttribute('aria-valuenow'),
    viewportWidth: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    scrollX
  })`);
  assert.equal(detailsMode.settingsInDetails, true);
  assert.equal(detailsMode.storyInLeftRail, true);
  assert.equal(detailsMode.modalBackdrop, false);
  assert.equal(detailsMode.evidenceVisible, true);
  assert.equal(detailsMode.assumptionsVisible, true);
  assert.equal(detailsMode.shareRun, false);
  assert.equal(detailsMode.settingsPressed, 'true');
  assert.equal(detailsMode.panelShadow, 'none');
  assert.equal(detailsMode.flatSettings, true);
  assert.equal(detailsMode.whiteSettings, true);
  assert.equal(detailsMode.rightResizer, true);
  assert.equal(detailsMode.rightResizeValue, '340');
  assert.ok(detailsMode.documentWidth <= detailsMode.viewportWidth);
  assert.equal(detailsMode.scrollX, 0);
  await evaluate(`document.querySelector('.rail-resizer-right').focus()`);
  await evaluate(
    `document.querySelector('.rail-resizer-right').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))`
  );
  await waitFor(
    `Number(document.querySelector('.rail-resizer-right').getAttribute('aria-valuenow')) === 356`,
    'The settings rail did not respond to keyboard resizing.'
  );
  const resizedLayout = await evaluate(`({
    viewportWidth: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    scrollX
  })`);
  assert.ok(resizedLayout.documentWidth <= resizedLayout.viewportWidth);
  assert.equal(resizedLayout.scrollX, 0);
  if (process.env.PLAYGROUND_SETTINGS_SCREENSHOT) {
    const capture = await command('Page.captureScreenshot', { format: 'png' });
    await writeFile(
      process.env.PLAYGROUND_SETTINGS_SCREENSHOT,
      Buffer.from(capture.data, 'base64')
    );
  }
  await evaluate(`document.querySelector('.details-panel .panel-close').click()`);
  await waitFor(
    `!document.querySelector('.details-panel') &&
      document.querySelector('.settings-trigger[aria-label="Open model settings"]').getAttribute('aria-pressed') === 'false'`,
    'The settings panel did not close.'
  );
  await evaluate(
    `document.querySelector('.settings-trigger[aria-label="Open model settings"]').click()`
  );
  await waitFor(
    `Boolean(document.querySelector('.run-tools input'))`,
    'The player toggle did not reopen model settings.'
  );
  const before = await evaluate(`document.querySelector('.run-tools input').value`);
  const statusBefore = await evaluate(
    `document.querySelector('.engine-status').textContent.trim()`
  );
  const metricsBefore = await evaluate(
    `[...document.querySelectorAll('[data-metric]')].map((node) => node.textContent).join('|')`
  );
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
  // The coupled model recomputes in tens of milliseconds, so the transient
  // `running` class can come and go between polls. Assert the OUTCOME — a
  // finished run whose numbers actually moved — rather than catching the
  // in-flight state, which was a race the model's speed exposed.
  await waitFor(
    `Boolean(document.querySelector('.engine-status.ready')) &&
      (document.querySelector('.engine-status').textContent.trim() !== ${JSON.stringify(statusBefore)} ||
        [...document.querySelectorAll('[data-metric]')].map((node) => node.textContent).join('|') !==
          ${JSON.stringify(metricsBefore)})`,
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

  await evaluate(`document.querySelector('.details-panel .panel-close').click()`);
  await waitFor(
    `!document.querySelector('.details-panel') && document.querySelector('.simulation-reader').classList.contains('details-closed')`,
    'The details rail did not close.'
  );
  assert.equal(
    await evaluate(
      `getComputedStyle(document.querySelector('.simulation-reader > .stage-panel')).gridColumnEnd`
    ),
    '-1',
    'Closing the details rail should give its width back to the visualization.'
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
  await evaluate(`document.querySelectorAll('.scenario-toggle')[1].click()`);
  await waitFor(
    `location.hash === '#economy' && Boolean(document.querySelector('.engine-status.ready'))`
  );

  const mobile = await evaluate(`({
    viewport: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    playLabel: document.querySelector('.transport-button').getAttribute('aria-label'),
    activeScenario: document.querySelector('.scenario-list > li.active > .scenario-toggle').textContent.trim(),
    storyDescriptionSize: Number.parseFloat(
      getComputedStyle(document.querySelector('.scenario-story > p')).fontSize
    ),
    ready: Boolean(document.querySelector('.engine-status.ready'))
  })`);

  assert.equal(mobile.viewport, 390);
  assert.ok(
    mobile.documentWidth <= mobile.viewport,
    'the mobile page must not overflow horizontally'
  );
  assert.equal(mobile.playLabel, 'Play simulation');
  assert.match(mobile.activeScenario, /Economy/);
  assert.ok(mobile.storyDescriptionSize >= 14);
  assert.equal(mobile.ready, true);

  if (process.env.PLAYGROUND_MOBILE_SCREENSHOT) {
    const capture = await command('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
    });
    await writeFile(process.env.PLAYGROUND_MOBILE_SCREENSHOT, Buffer.from(capture.data, 'base64'));
  }

  await evaluate(`[
    ...document.querySelectorAll('body > header nav a')
  ].find((link) => link.textContent.trim() === 'Playground').click()`);
  await waitFor(
    `location.pathname === '/playground/' &&
      location.hash === '#combined' &&
      document.querySelector('.scenario-list > li.active > .scenario-toggle strong')?.textContent.trim() === 'Coupled'`,
    'The top-bar Playground link did not return the app to the coupled scenario.'
  );

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
