import { useEffect, useMemo, useState } from 'react';
import rough from 'roughjs';
import {
  APPROVED_CONNECTOR_GEOMETRIES,
  NOTEBOOK_CONNECTION_PATTERNS,
  NOTEBOOK_CONNECTOR_MEDIUM,
  openArrowHeadPath,
  type DiagramPoint,
} from '@components/diagram/connectorInk';
import styles from './StrokeLab.module.css';

interface Geometry {
  id: string;
  label: string;
  note: string;
  path: string;
  end: DiagramPoint;
  tangent: DiagramPoint;
}

interface StrokeProfile {
  id: string;
  label: string;
  note: string;
  roughness: number;
  bowing: number;
  maxRandomnessOffset: number;
  disableMultiStroke: boolean;
  preserveVertices: boolean;
  strokeWidth: number;
}

interface PatternRecipe {
  id: 'solid' | 'dash-long' | 'dash-short' | 'dot-open' | 'dot-dense';
  label: string;
  note: string;
  dashArray?: string;
}

const SEEDS = [1103, 4409, 7919] as const;

const SOLID_PATTERN: PatternRecipe = {
  id: NOTEBOOK_CONNECTION_PATTERNS.solid.id,
  label: 'solid',
  note: 'ordinary directed relation',
};

const PATTERN_RECIPES: PatternRecipe[] = [
  {
    id: NOTEBOOK_CONNECTION_PATTERNS.dashLong.id,
    label: 'long dash',
    note: 'strong discontinuity; remains readable at small sizes',
    dashArray: NOTEBOOK_CONNECTION_PATTERNS.dashLong.dashArray,
  },
  {
    id: NOTEBOOK_CONNECTION_PATTERNS.dashShort.id,
    label: 'short dash',
    note: 'quieter discontinuity for secondary relations',
    dashArray: NOTEBOOK_CONNECTION_PATTERNS.dashShort.dashArray,
  },
  {
    id: NOTEBOOK_CONNECTION_PATTERNS.dotOpen.id,
    label: 'open dot',
    note: 'widely spaced uncertainty or indirect influence',
    dashArray: NOTEBOOK_CONNECTION_PATTERNS.dotOpen.dashArray,
  },
  {
    id: NOTEBOOK_CONNECTION_PATTERNS.dotDense.id,
    label: 'dense dot',
    note: 'more continuous at graph scale',
    dashArray: NOTEBOOK_CONNECTION_PATTERNS.dotDense.dashArray,
  },
];

const GEOMETRIES: Geometry[] = [
  {
    id: 'direct',
    label: 'direct',
    note: 'short causal relation',
    path: 'M26 55L294 55',
    end: { x: 294, y: 55 },
    tangent: { x: 1, y: 0 },
  },
  {
    id: 'bow-shallow',
    label: 'shallow bow',
    note: 'clear one nearby obstacle',
    path: 'M26 67Q156 25 294 57',
    end: { x: 294, y: 57 },
    tangent: { x: 138, y: 32 },
  },
  {
    id: 'bow-deep',
    label: 'deep bow',
    note: 'travel along the diagram edge',
    path: 'M26 80Q159 -7 294 60',
    end: { x: 294, y: 60 },
    tangent: { x: 135, y: 67 },
  },
  {
    id: 's-soft',
    label: 'soft S',
    note: 'weave between two points',
    path: 'M26 61C101 10 209 105 294 54',
    end: { x: 294, y: 54 },
    tangent: { x: 85, y: -51 },
  },
  {
    id: 's-offset',
    label: 'offset S',
    note: 'enter a target from above',
    path: 'M26 82C91 87 101 19 164 22C221 25 234 78 294 51',
    end: { x: 294, y: 51 },
    tangent: { x: 60, y: -27 },
  },
  {
    id: 's-double',
    label: 'double S',
    note: 'route around two obstacles',
    path: 'M26 66C73 8 112 10 150 51C187 92 226 99 253 69C269 51 280 44 294 48',
    end: { x: 294, y: 48 },
    tangent: { x: 14, y: 4 },
  },
  {
    id: 'edge-sweep',
    label: 'edge sweep',
    note: 'keep annotation ink outside content',
    path: 'M26 86C70 104 108 105 148 101C220 94 245 12 294 49',
    end: { x: 294, y: 49 },
    tangent: { x: 49, y: 37 },
  },
  {
    id: 'return',
    label: 'return curve',
    note: 'feedback into a later time-slice',
    path: 'M26 40C62 4 126 7 143 39C163 77 92 100 137 104C205 111 232 79 294 58',
    end: { x: 294, y: 58 },
    tangent: { x: 62, y: -21 },
  },
];

const PROFILES: StrokeProfile[] = [
  {
    id: 'single-current',
    label: 'single / current',
    note: 'Our present clean connector. Useful control; too uniform for the desired ink.',
    roughness: 0.92,
    bowing: 0.96,
    maxRandomnessOffset: 1.48,
    disableMultiStroke: true,
    preserveVertices: false,
    strokeWidth: 1.08,
  },
  {
    id: 'double-quiet',
    label: 'double / quiet',
    note: 'Two restrained passes. Mostly one line, with occasional separation.',
    roughness: 0.52,
    bowing: 0.56,
    maxRandomnessOffset: 0.9,
    disableMultiStroke: false,
    preserveVertices: true,
    strokeWidth: 1.08,
  },
  {
    id: 'double-clean',
    label: 'double / clean medium',
    note: 'The leading candidate: controlled overlap without hairy edges.',
    roughness: 0.68,
    bowing: 0.74,
    maxRandomnessOffset: 1.12,
    disableMultiStroke: false,
    preserveVertices: true,
    strokeWidth: 1.12,
  },
  {
    id: 'double-split',
    label: 'double / visible split',
    note: 'More thick–thin–thick rhythm and visible local divergence.',
    roughness: 0.88,
    bowing: 0.92,
    maxRandomnessOffset: 1.52,
    disableMultiStroke: false,
    preserveVertices: true,
    strokeWidth: 1.12,
  },
  {
    id: 'rough-reference',
    label: 'selected / notebook medium',
    note: 'Approved across direct, shallow/deep bow, and soft-S routes in all three seeds.',
    roughness: NOTEBOOK_CONNECTOR_MEDIUM.roughness,
    bowing: NOTEBOOK_CONNECTOR_MEDIUM.bowing,
    maxRandomnessOffset: NOTEBOOK_CONNECTOR_MEDIUM.maxRandomnessOffset,
    disableMultiStroke: NOTEBOOK_CONNECTOR_MEDIUM.disableMultiStroke,
    preserveVertices: NOTEBOOK_CONNECTOR_MEDIUM.preserveVertices,
    strokeWidth: NOTEBOOK_CONNECTOR_MEDIUM.strokeWidth,
  },
];

const SELECTED_PROFILE = PROFILES.find((profile) => profile.id === 'rough-reference')!;
const PATTERN_GEOMETRIES = GEOMETRIES.filter((geometry) =>
  APPROVED_CONNECTOR_GEOMETRIES.includes(
    geometry.id as (typeof APPROVED_CONNECTOR_GEOMETRIES)[number]
  )
);

const generator = rough.generator({
  options: {
    fixedDecimalPlaceDigits: 2,
  },
});

type RoughDrawable = ReturnType<typeof generator.path>;

function drawable(path: string, profile: StrokeProfile, seed: number): RoughDrawable {
  return generator.path(path, {
    seed,
    stroke: 'currentColor',
    strokeWidth: profile.strokeWidth,
    fill: 'none',
    roughness: profile.roughness,
    bowing: profile.bowing,
    maxRandomnessOffset: profile.maxRandomnessOffset,
    disableMultiStroke: profile.disableMultiStroke,
    preserveVertices: profile.preserveVertices,
  });
}

function RoughPaths({ value, dashArray }: { value: RoughDrawable; dashArray?: string }) {
  return generator
    .toPaths(value)
    .map((path, index) => (
      <path
        d={path.d}
        fill={path.fill}
        key={`${path.d}-${index}`}
        stroke={path.stroke}
        strokeDasharray={dashArray}
        strokeWidth={path.strokeWidth}
        vectorEffect="non-scaling-stroke"
      />
    ));
}

function StrokeSpecimen({
  geometry,
  profile,
  seed,
  selected,
  onToggle,
  pattern = SOLID_PATTERN,
}: {
  geometry: Geometry;
  profile: StrokeProfile;
  seed: number;
  selected: boolean;
  onToggle: () => void;
  pattern?: PatternRecipe;
}) {
  const patternId = pattern.id === 'solid' ? '' : `.${pattern.id}`;
  const id = `${geometry.id}.${profile.id}${patternId}.s${seed}`;
  const shaft = useMemo(
    () => drawable(geometry.path, profile, seed),
    [geometry.path, profile, seed]
  );
  const head = useMemo(
    () => drawable(openArrowHeadPath(geometry.end, geometry.tangent), profile, seed + 37),
    [geometry.end, geometry.tangent, profile, seed]
  );

  return (
    <button
      aria-label={`${selected ? 'Remove' : 'Add'} ${id} ${selected ? 'from' : 'to'} shortlist`}
      aria-pressed={selected}
      className={styles.specimen}
      onClick={onToggle}
      type="button"
    >
      <span className={styles.seedLabel}>S{seed}</span>
      <svg aria-hidden="true" viewBox="0 0 320 112">
        <g>
          <RoughPaths dashArray={pattern.dashArray} value={shaft} />
          <RoughPaths value={head} />
        </g>
      </svg>
      <span className={styles.specimenId}>{id}</span>
      <span className={styles.pickMark} aria-hidden="true">
        {selected ? 'kept ✓' : 'keep?'}
      </span>
    </button>
  );
}

const STORAGE_KEY = 'eq-stroke-lab-shortlist-v1';

export default function StrokeLab() {
  const [selected, setSelected] = useState<string[]>([]);
  const [copyLabel, setCopyLabel] = useState('copy shortlist');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setSelected(JSON.parse(saved) as string[]);
    } catch {
      // A shortlist is a convenience; the specimen page still works without local storage.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    } catch {
      // Keep selection in memory when storage is unavailable.
    }
  }, [selected]);

  const toggle = (id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((candidate) => candidate !== id) : [...current, id]
    );
    setCopyLabel('copy shortlist');
  };

  const copyShortlist = async () => {
    if (selected.length === 0) return;
    try {
      await navigator.clipboard.writeText(selected.join('\n'));
      setCopyLabel('copied ✓');
    } catch {
      setCopyLabel('select IDs below');
    }
  };

  return (
    <div className={styles.lab}>
      <header className={styles.header}>
        <nav aria-label="Stroke lab navigation">
          <a href="/brand/prototype">← brand prototype</a>
          <span>DIAGRAM INK / WORKING SPECIMEN</span>
        </nav>
        <div className={styles.headerGrid}>
          <div>
            <p className={styles.eyebrow}>STROKE LAB / REVISION 01</p>
            <h1>Find the line before we build the tool.</h1>
          </div>
          <div className={styles.intro}>
            <p>
              Every arrow below uses an open <strong>→</strong> head drawn with the same rough ink
              as its shaft. Select individual specimens you would trust in a diagram.
            </p>
            <p>
              Compare the same route across three seeds. A useful profile must remain good across
              all three—not merely produce one lucky line.
            </p>
          </div>
        </div>
      </header>

      <aside className={styles.shortlist} aria-label="Selected stroke specimens">
        <div>
          <span>SHORTLIST / {selected.length.toString().padStart(2, '0')}</span>
          <p>{selected.length ? selected.join(' · ') : 'Click any line worth keeping.'}</p>
        </div>
        <div className={styles.shortlistActions}>
          <button disabled={selected.length === 0} onClick={copyShortlist} type="button">
            {copyLabel}
          </button>
          <button disabled={selected.length === 0} onClick={() => setSelected([])} type="button">
            clear
          </button>
        </div>
      </aside>

      <div className={styles.profiles}>
        <section className={`${styles.profile} ${styles.patternStudy}`} id="line-patterns">
          <header className={styles.profileHeader}>
            <span>00 / CONNECTION PATTERN</span>
            <h2>dash + dot / selected ink</h2>
            <p>
              Pattern experiments use the approved two-pass profile. Arrowheads stay solid so
              direction remains legible when the shaft is discontinuous.
            </p>
            <dl>
              <div>
                <dt>ink token</dt>
                <dd>{NOTEBOOK_CONNECTOR_MEDIUM.id}</dd>
              </div>
              <div>
                <dt>status</dt>
                <dd>select before assigning meaning</dd>
              </div>
            </dl>
          </header>

          <div className={styles.patternList}>
            {PATTERN_RECIPES.map((pattern) => (
              <section className={styles.patternGroup} key={pattern.id}>
                <header>
                  <h3>{pattern.label}</h3>
                  <p>
                    {pattern.note} / <span>{pattern.dashArray}</span>
                  </p>
                </header>
                <div className={styles.geometryList}>
                  {PATTERN_GEOMETRIES.map((geometry) => (
                    <article className={styles.geometry} key={geometry.id}>
                      <header>
                        <span>{geometry.label}</span>
                        <small>{geometry.note}</small>
                      </header>
                      <div className={styles.seedGrid}>
                        {SEEDS.map((seed) => {
                          const id = `${geometry.id}.${SELECTED_PROFILE.id}.${pattern.id}.s${seed}`;
                          return (
                            <StrokeSpecimen
                              geometry={geometry}
                              key={id}
                              onToggle={() => toggle(id)}
                              pattern={pattern}
                              profile={SELECTED_PROFILE}
                              seed={seed}
                              selected={selected.includes(id)}
                            />
                          );
                        })}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        {PROFILES.map((profile, profileIndex) => (
          <section className={styles.profile} id={profile.id} key={profile.id}>
            <header className={styles.profileHeader}>
              <span>{String(profileIndex + 1).padStart(2, '0')} / INK RECIPE</span>
              <h2>{profile.label}</h2>
              <p>{profile.note}</p>
              <dl>
                <div>
                  <dt>roughness</dt>
                  <dd>{profile.roughness}</dd>
                </div>
                <div>
                  <dt>bowing</dt>
                  <dd>{profile.bowing}</dd>
                </div>
                <div>
                  <dt>offset</dt>
                  <dd>{profile.maxRandomnessOffset}</dd>
                </div>
                <div>
                  <dt>passes</dt>
                  <dd>{profile.disableMultiStroke ? '1' : '2'}</dd>
                </div>
              </dl>
            </header>

            <div className={styles.geometryList}>
              {GEOMETRIES.map((geometry) => (
                <article className={styles.geometry} key={geometry.id}>
                  <header>
                    <span>{geometry.label}</span>
                    <small>{geometry.note}</small>
                  </header>
                  <div className={styles.seedGrid}>
                    {SEEDS.map((seed) => {
                      const id = `${geometry.id}.${profile.id}.s${seed}`;
                      return (
                        <StrokeSpecimen
                          geometry={geometry}
                          key={id}
                          onToggle={() => toggle(id)}
                          profile={profile}
                          seed={seed}
                          selected={selected.includes(id)}
                        />
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className={styles.footer}>
        <p>
          Selection contract: <strong>geometry.profile.seed</strong>
        </p>
        <p>
          Next: promote the chosen recipes into named connector tokens, then encode those tokens in
          the reusable diagram tool.
        </p>
      </footer>
    </div>
  );
}
