import assert from 'node:assert/strict';
import test from 'node:test';

import { LEDGER_SYSTEM } from '../src/engine/kernel.js';
import { scenarioById } from '../src/scenarios/registry.ts';
import { showcaseChapters } from '../src/showcase/script.ts';
import { combinedInfluenceDiagram } from '../src/showcase/scroll/influenceDiagramData.ts';
import { scrollFlow } from '../src/showcase/scroll/script.ts';

// Mirrors showcase-contracts.test.js: hardcoded so the test never imports
// DOM-adjacent rendering code under node --test.
const viewsByScenario = {
  combined: new Set(['network']),
  economy: new Set(['network']),
  culture: new Set(['network', 'lorenz']),
  politics: new Set(['network', 'lorenz']),
};

test('the scroll prototype walks the compressed arc over real machinery', () => {
  // Owner-decided shape (task-0007 v3, 2026-08-06): confusion, then the
  // basic version of each model as one slide each, then the combined model
  // with its influence diagram, then the building-blocks close into the
  // only interactive element.
  const segments = scrollFlow.filter((item) => item.kind === 'segment');
  assert.deepEqual(
    segments.map((segment) => segment.id),
    ['wall', 'money', 'attention', 'votes', 'combined']
  );
  assert.deepEqual(
    segments.map((segment) => segment.scenario),
    ['combined', 'economy', 'culture', 'politics', 'combined']
  );

  // The length cut is a decision, so it is a tested property: the middle
  // three machines are one slide each, and the whole essay stays short.
  for (const id of ['money', 'attention', 'votes']) {
    const segment = segments.find((candidate) => candidate.id === id);
    assert.equal(segment.steps.length, 1, `${id} is a single slide`);
  }
  const totalSteps = segments.reduce((count, segment) => count + segment.steps.length, 0);
  assert.ok(totalSteps <= 10, `the essay stays short (${totalSteps} steps)`);

  assert.equal(scrollFlow[0].kind, 'segment', 'the page opens on the cold open');
  assert.equal(scrollFlow[0].steps[0].id, 'coldopen');
  assert.equal(scrollFlow[0].steps[0].stage.kind, 'run');

  // Owner direction (2026-08-06): the copy is explicit and scientific about
  // what is being simulated — the opening names the hypothesis and its
  // authors, and the paper stays linked.
  assert.ok(
    scrollFlow[0].steps[0].body.includes('Gradual disempowerment') &&
      scrollFlow[0].steps[0].body.includes('Kulveit'),
    'the cold open names the hypothesis and its authors'
  );

  const scoreboard = scrollFlow[scrollFlow.length - 1];
  assert.equal(scoreboard.kind, 'leaderboard', 'the scoreboard closes the page as the outlook');
  assert.ok(
    scoreboard.intro.some((paragraph) => paragraph.includes('illustrative')),
    'the scoreboard framing names its numbers as illustrative'
  );
  assert.ok(
    scoreboard.intro.some((paragraph) => paragraph.toLowerCase().includes('portfolio')),
    'the scoreboard framing scores portfolios, not single mechanisms'
  );
  const last = scrollFlow[scrollFlow.length - 2];
  assert.equal(last.kind, 'playable', 'the only interaction precedes the scoreboard');
  const prose = scrollFlow[scrollFlow.length - 3];
  assert.equal(prose.kind, 'prose', 'the building-blocks section precedes the playable ending');
  assert.ok(
    prose.links?.some((link) => link.href.includes('equilibria1.substack.com')),
    'the argument post stays linked'
  );
  assert.ok(
    prose.links?.some((link) => link.href.includes('arxiv.org/abs/2501.16946')),
    'the Gradual Disempowerment paper stays linked'
  );

  // The playable ending is the canonical chapter, not a fork.
  const playChapter = showcaseChapters.find((chapter) => chapter.id === 'play');
  assert.equal(last.chapter, playChapter);

  // The combined segment carries the sealed/coupled contrast and the
  // influence diagram, whose copy must state its illustrative status.
  const combined = segments.find((segment) => segment.id === 'combined');
  assert.deepEqual(
    combined.steps.map((step) => step.id),
    ['sealed', 'coupled', 'diagram']
  );
  assert.equal(combined.steps[2].stage.kind, 'diagram');
  assert.ok(
    combined.steps[2].body.includes('illustrative'),
    'the diagram step names the model as illustrative'
  );

  for (const item of scrollFlow) {
    if (item.kind === 'prose') {
      assert.ok(item.paragraphs.length >= 1, `${item.id} needs paragraphs`);
      continue;
    }
    if (item.kind !== 'segment') continue;

    assert.ok(item.eyebrow && item.title, `${item.id} carries its chrome`);
    const ids = item.steps.map((step) => step.id);
    assert.equal(new Set(ids).size, ids.length, `${item.id} step ids are unique`);

    const definition = item.scenario ? scenarioById[item.scenario] : undefined;
    if (item.headlineMetric) {
      assert.ok(
        definition?.metrics.some((metric) => metric.key === item.headlineMetric),
        `${item.id} headline metric must exist on ${item.scenario}`
      );
    }

    for (const step of item.steps) {
      assert.ok(step.headline && step.body && step.stageLabel, `${item.id}/${step.id} needs copy`);
      if (step.stage.kind === 'placeholder') {
        assert.ok(step.stage.label && step.stage.note, `${item.id}/${step.id} placeholder chrome`);
        continue;
      }
      if (step.stage.kind !== 'run') continue;
      assert.ok(definition, `${item.id} stages a run but names no scenario`);
      assert.ok(
        viewsByScenario[item.scenario].has(step.stage.view),
        `${item.id}/${step.id} references view ${step.stage.view}`
      );
      assert.ok(step.stage.tick >= 0, `${item.id}/${step.id} needs a valid tick`);
      if (step.stage.playTo !== undefined) {
        assert.ok(step.stage.playTo > step.stage.tick, `${item.id}/${step.id} must move forward`);
      }
      if (step.stage.preset) {
        assert.ok(
          definition.presets.some((preset) => preset.id === step.stage.preset),
          `${item.id}/${step.id} references unknown preset ${step.stage.preset}`
        );
      }
    }
  }
});

test('the influence diagram is traceable to the combined model fixture', () => {
  // Task-0007 discipline: layout is authored, content is not. Every node
  // names engine fields, every edge names the transforms it summarizes and
  // the fields it reads from its source and writes into its target, and
  // every dial is a real registry parameter. A figure that cannot pass
  // this check does not ship.
  const fields = new Set(
    LEDGER_SYSTEM.nodes.filter((node) => node.kind === 'field').map((node) => node.id)
  );
  const transforms = new Map(
    LEDGER_SYSTEM.nodes.filter((node) => node.kind === 'transform').map((node) => [node.id, node])
  );

  const diagramNodes = new Map(combinedInfluenceDiagram.nodes.map((node) => [node.id, node]));
  for (const node of combinedInfluenceDiagram.nodes) {
    assert.ok(node.fields.length >= 1, `node ${node.id} aggregates at least one field`);
    for (const field of node.fields) {
      assert.ok(fields.has(field), `node ${node.id} names unknown field ${field}`);
    }
  }

  for (const edge of combinedInfluenceDiagram.edges) {
    const fromNode = diagramNodes.get(edge.from);
    const toNode = diagramNodes.get(edge.to);
    assert.ok(fromNode && toNode, `edge ${edge.id} connects unknown nodes`);
    assert.ok(edge.transforms.length >= 1, `edge ${edge.id} names at least one transform`);
    for (const name of edge.transforms) {
      assert.ok(transforms.has(name), `edge ${edge.id} names unknown transform ${name}`);
    }
    assert.ok(
      edge.reads.some((field) =>
        edge.transforms.some((name) => transforms.get(name).reads.includes(field))
      ),
      `edge ${edge.id}: no named transform reads any of its read fields`
    );
    assert.ok(
      edge.writes.some((field) =>
        edge.transforms.some((name) => transforms.get(name).writes.includes(field))
      ),
      `edge ${edge.id}: no named transform writes any of its write fields`
    );
    if (!edge.selfLoop) {
      assert.ok(
        edge.reads.some((field) => fromNode.fields.includes(field)),
        `edge ${edge.id}: reads must come from its source node's fields`
      );
      assert.ok(
        edge.writes.some((field) => toNode.fields.includes(field)),
        `edge ${edge.id}: writes must land in its target node's fields`
      );
    }
    if (edge.dial) {
      assert.ok(
        scenarioById.combined.parameters.some((parameter) => parameter.key === edge.dial),
        `edge ${edge.id} names unknown dial ${edge.dial}`
      );
    }
  }

  // The three emphasized channels are exactly the cross-system couplings.
  const channels = combinedInfluenceDiagram.edges.filter((edge) => edge.channel);
  assert.deepEqual(channels.map((edge) => edge.id).sort(), ['advertise', 'attract', 'lobby']);
  for (const edge of channels) {
    assert.ok(edge.dial, `channel ${edge.id} must name its dial`);
  }
});
