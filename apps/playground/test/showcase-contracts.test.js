import assert from 'node:assert/strict';
import test from 'node:test';

import { scenarioById } from '../src/scenarios/registry.ts';
import { showcaseChapters } from '../src/showcase/script.ts';

// Mirrors scenario-contracts.test.js: hardcoded so the test never imports
// DOM-adjacent rendering code under node --test. These are the showcase's
// own views (src/showcase/scenes), not the playground's.
const viewsByScenario = {
  combined: new Set(['network']),
  economy: new Set(['network']),
  culture: new Set(['network', 'lorenz']),
  politics: new Set(['network', 'lorenz']),
};

test('the showcase walks the gradual-disempowerment arc over real machinery', () => {
  // Owner-decided shape (task-0006 v2): a prose opener that links the
  // Substack argument, the coupled world, the models simply stated, the
  // three subsystems in economy → politics → culture order, and a playable
  // coupled ending.
  assert.equal(showcaseChapters[0].kind, 'prose');
  assert.ok(
    showcaseChapters[0].links?.some((link) => link.href.includes('equilibria1.substack.com')),
    'the opener must link the argument post'
  );
  assert.deepEqual(
    showcaseChapters.filter((chapter) => chapter.kind === 'model').map((c) => c.scenario),
    ['combined', 'economy', 'politics', 'culture']
  );

  const assumptionChapters = showcaseChapters.filter((chapter) => chapter.kind === 'assumptions');
  assert.equal(assumptionChapters.length, 1, 'exactly one assumptions chapter');
  const blocks = assumptionChapters[0].blocks ?? [];
  assert.ok(blocks.length >= 3, 'the basic models are each stated');
  for (const block of blocks) {
    assert.ok(block.id && block.title, 'assumption blocks carry chrome');
    assert.ok(block.assumptions.length >= 2, `${block.id} states its assumptions`);
    assert.ok(block.input && block.output, `${block.id} states input and output`);
  }

  const playable = showcaseChapters[showcaseChapters.length - 1];
  assert.equal(playable.kind, 'playable');
  assert.equal(playable.scenario, 'combined');
  assert.ok(
    playable.links?.some((link) => link.href.startsWith('/playground')),
    'the ending must point into the full playground'
  );

  // The reduced tray: three groups of four distinct range dials, every one a
  // real registry parameter, and every chip state reachable within them.
  const combined = scenarioById.combined;
  const groups = playable.dialGroups ?? [];
  assert.equal(groups.length, 3, 'three dial groups');
  const dialKeys = groups.flatMap((group) => group.params);
  assert.equal(dialKeys.length, 12, 'four dials per group');
  assert.equal(new Set(dialKeys).size, 12, 'dials are distinct');
  for (const key of dialKeys) {
    const parameter = combined.parameters.find((candidate) => candidate.key === key);
    assert.ok(parameter, `dial ${key} must exist on the combined scenario`);
    assert.equal(parameter.kind, 'range', `dial ${key} must be a slider`);
  }
  const chips = playable.presetChips ?? [];
  assert.deepEqual(chips, ['sealed', 'coupled', 'defended', 'collapse']);
  const dialSet = new Set(dialKeys);
  for (const chipId of chips) {
    const preset = combined.presets.find((candidate) => candidate.id === chipId);
    assert.ok(preset, `chip ${chipId} must exist in the registry`);
    for (const key of Object.keys(preset.values)) {
      assert.ok(
        dialSet.has(key),
        `chip ${chipId} sets ${key}, which must be escapable via the tray`
      );
    }
  }

  for (const chapter of showcaseChapters) {
    assert.ok(chapter.id && chapter.eyebrow && chapter.title, 'chapters carry their chrome');
    assert.ok(chapter.intro.length > 0, `${chapter.id} needs intro prose`);

    if (chapter.kind !== 'model') {
      assert.equal(chapter.beats.length, 0, `${chapter.id} stages no beats`);
      continue;
    }

    const definition = scenarioById[chapter.scenario];
    assert.ok(definition, `${chapter.id} references unknown scenario ${chapter.scenario}`);
    assert.ok(chapter.beats.length >= 2, `${chapter.id} needs at least two beats to compare`);

    if (chapter.headlineMetric) {
      assert.ok(
        definition.metrics.some((metric) => metric.key === chapter.headlineMetric),
        `${chapter.id} headline metric ${chapter.headlineMetric} must exist on ${definition.id}`
      );
    }

    const viewKeys = viewsByScenario[chapter.scenario];
    const presetIds = new Set(definition.presets.map(({ id }) => id));
    for (const [index, beat] of chapter.beats.entries()) {
      assert.ok(beat.id && beat.title && beat.body, `${chapter.id}.beats[${index}] needs copy`);
      assert.ok(
        viewKeys.has(beat.view),
        `${chapter.id}.beats[${index}] references view ${beat.view}`
      );
      assert.ok(beat.tick >= 0, `${chapter.id}.beats[${index}] needs a valid tick`);
      if (beat.playTo !== undefined) {
        assert.ok(beat.playTo > beat.tick, `${chapter.id}.beats[${index}] must move forward`);
      }
      if (beat.preset) {
        assert.ok(
          presetIds.has(beat.preset),
          `${chapter.id}.beats[${index}] references unknown preset ${beat.preset}`
        );
      }
    }
  }
});
