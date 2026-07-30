const SVG_NS = 'http://www.w3.org/2000/svg';

export const INK = '#1e1e1e';
export const NAVY = '#003b7e';
export const MECH_BLUE = '#1c7ed6';
export const MECH_ORANGE = '#f08c00';
export const ALERT_RED = '#e03131';
export const ZONE_TINT = '#edf3f9';
export const LABEL = '#8a94a0';

type Attributes = Record<string, string | number>;
type Point = [number, number];

interface PathOptions {
  seed?: number;
  stroke?: string;
  width?: number;
  roughness?: number;
  close?: boolean;
  fill?: string;
  opacity?: number;
  dash?: string;
}

export function svgElement(tag: string, attributes: Attributes, parent?: SVGElement): SVGElement {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
  parent?.appendChild(node);
  return node;
}

export function clip(value: number, lower: number, upper: number): number {
  return Math.min(Math.max(value, lower), upper);
}

export function makeRng(seed: number) {
  let state = seed | 0;
  return {
    uniform() {
      state = (state + 0x6d2b79f5) | 0;
      let value = Math.imul(state ^ (state >>> 15), 1 | state);
      value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    },
  };
}

export function fires(
  step: number,
  {
    cadence = 1,
    phaseOffset = 0,
    onset = 0,
  }: { cadence?: number; phaseOffset?: number; onset?: number } = {}
): boolean {
  if (step < onset) return false;
  const remainder = (step - phaseOffset) % cadence;
  return (remainder + cadence) % cadence === 0;
}

function jitterPoints(points: Point[], seed: number, pass: number, roughness: number): Point[] {
  const rng = makeRng((seed * 7919 + pass * 104729) | 0);
  const output: Point[] = [];
  for (let index = 0; index < points.length - 1; index += 1) {
    const [x1, y1] = points[index];
    const [x2, y2] = points[index + 1];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy) || 1;
    const nx = -dy / length;
    const ny = dx / length;
    const segments = Math.max(1, Math.round(length / 24));
    for (let segment = 0; segment < segments; segment += 1) {
      const t = segment / segments;
      const wobble = roughness * 1.5 * (rng.uniform() * 2 - 1);
      output.push([x1 + dx * t + nx * wobble, y1 + dy * t + ny * wobble]);
    }
  }
  output.push(points.at(-1)!);
  return output;
}

let hatchId = 0;

export const Sketch = {
  path(parent: SVGElement, points: Point[], options: PathOptions = {}) {
    const {
      seed = 1,
      stroke = INK,
      width = 1.4,
      roughness = 0.8,
      close = false,
      fill = 'none',
      opacity = 1,
      dash = '',
    } = options;
    const group = svgElement('g', opacity !== 1 ? { opacity } : {}, parent);
    const allPoints = close ? [...points, points[0]] : points;
    for (let pass = 0; pass < 2; pass += 1) {
      const jittered = jitterPoints(allPoints, seed, pass, roughness);
      const path = `M${jittered
        .map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`)
        .join(' L')}${close ? ' Z' : ''}`;
      svgElement(
        'path',
        {
          d: path,
          fill: pass === 0 ? fill : 'none',
          stroke,
          'stroke-width': width,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          opacity: pass === 0 ? 1 : 0.55,
          ...(dash ? { 'stroke-dasharray': dash } : {}),
        },
        group
      );
    }
    return group;
  },

  ellipsePoints(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    count = 18,
    wobble = 0,
    seed = 1
  ): Point[] {
    const rng = makeRng((seed * 31 + 7) | 0);
    return Array.from({ length: count }, (_, index) => {
      const angle = (index / count) * 2 * Math.PI;
      const radialWobble = 1 + wobble * (rng.uniform() * 2 - 1);
      return [cx + rx * radialWobble * Math.cos(angle), cy + ry * radialWobble * Math.sin(angle)];
    });
  },

  circle(parent: SVGElement, cx: number, cy: number, radius: number, options: PathOptions = {}) {
    return this.path(parent, this.ellipsePoints(cx, cy, radius, radius, 16, 0, options.seed), {
      close: true,
      ...options,
    });
  },

  blob(parent: SVGElement, cx: number, cy: number, radius: number, options: PathOptions = {}) {
    return this.path(parent, this.ellipsePoints(cx, cy, radius, radius, 18, 0.09, options.seed), {
      close: true,
      ...options,
    });
  },

  square(parent: SVGElement, cx: number, cy: number, size: number, options: PathOptions = {}) {
    const half = size / 2;
    return this.path(
      parent,
      [
        [cx - half, cy - half],
        [cx + half, cy - half],
        [cx + half, cy + half],
        [cx - half, cy + half],
      ],
      { close: true, ...options }
    );
  },

  diamond(parent: SVGElement, cx: number, cy: number, size: number, options: PathOptions = {}) {
    const half = size / 2;
    return this.path(
      parent,
      [
        [cx, cy - half],
        [cx + half, cy],
        [cx, cy + half],
        [cx - half, cy],
      ],
      { close: true, ...options }
    );
  },

  line(
    parent: SVGElement,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options: PathOptions = {}
  ) {
    return this.path(
      parent,
      [
        [x1, y1],
        [x2, y2],
      ],
      options
    );
  },

  plainLine(
    parent: SVGElement,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    stroke = '#c3ccd6',
    width = 1,
    dash = ''
  ) {
    return svgElement(
      'line',
      {
        x1,
        y1,
        x2,
        y2,
        stroke,
        'stroke-width': width,
        ...(dash ? { 'stroke-dasharray': dash } : {}),
      },
      parent
    );
  },

  edge(
    parent: SVGElement,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    {
      trim1 = 12,
      trim2 = 14,
      stroke = '#9aa2ab',
      width = 1,
      seed = 1,
      opacity = 1,
      arrow = true,
    }: {
      trim1?: number;
      trim2?: number;
      stroke?: string;
      width?: number;
      seed?: number;
      opacity?: number;
      arrow?: boolean;
    } = {}
  ) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy) || 1;
    const ux = dx / length;
    const uy = dy / length;
    const ax = x1 + ux * trim1;
    const ay = y1 + uy * trim1;
    const bx = x2 - ux * trim2;
    const by = y2 - uy * trim2;
    this.line(parent, ax, ay, bx, by, {
      stroke,
      width,
      seed,
      opacity,
      dash: '4,4',
      roughness: 0.5,
    });
    if (arrow) this.arrowHead(parent, bx, by, Math.atan2(uy, ux), stroke, width, opacity);
  },

  arrowHead(
    parent: SVGElement,
    x: number,
    y: number,
    angle: number,
    stroke: string,
    width = 1,
    opacity = 1
  ) {
    const back = angle + Math.PI;
    for (const offset of [-0.46, 0.46]) {
      this.plainLine(
        parent,
        x,
        y,
        x + 7.5 * Math.cos(back + offset),
        y + 7.5 * Math.sin(back + offset),
        stroke,
        width
      ).setAttribute('opacity', String(opacity));
    }
  },

  packet(
    parent: SVGElement,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    fraction: number,
    { size = 7, color = INK, opacity = 1, rot = 8 } = {}
  ) {
    const x = x1 + (x2 - x1) * fraction;
    const y = y1 + (y2 - y1) * fraction;
    svgElement(
      'rect',
      {
        x: x - size / 2,
        y: y - size / 2,
        width: size,
        height: size,
        rx: 1.5,
        fill: color,
        opacity,
        transform: `rotate(${rot} ${x} ${y})`,
      },
      parent
    );
  },

  hatchEllipse(
    parent: SVGElement,
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    color: string,
    seed = 1
  ) {
    const id = `playground-hatch-${++hatchId}`;
    const definitions = svgElement('defs', {}, parent);
    svgElement('ellipse', { cx, cy, rx, ry }, svgElement('clipPath', { id }, definitions));
    const hatch = svgElement('g', { 'clip-path': `url(#${id})`, opacity: 0.28 }, parent);
    for (let x = cx - rx - ry; x < cx + rx + ry; x += 11) {
      svgElement(
        'line',
        {
          x1: x,
          y1: cy + ry + 4,
          x2: x + 2 * ry,
          y2: cy - ry - 4,
          stroke: color,
          'stroke-width': 1,
        },
        hatch
      );
    }
    this.path(parent, this.ellipsePoints(cx, cy, rx, ry, 26, 0.02, seed), {
      close: true,
      stroke: color,
      width: 1.5,
      roughness: 0.9,
      seed,
    });
  },

  text(
    parent: SVGElement,
    x: number,
    y: number,
    content: string,
    {
      size = 11,
      color = INK,
      opacity = 1,
      hand = false,
      anchor = 'start',
      spacing = 0,
    }: {
      size?: number;
      color?: string;
      opacity?: number;
      hand?: boolean;
      anchor?: string;
      spacing?: number;
    } = {}
  ) {
    const text = svgElement(
      'text',
      {
        x,
        y,
        'font-size': size,
        fill: color,
        opacity,
        'text-anchor': anchor,
        ...(spacing ? { 'letter-spacing': spacing } : {}),
      },
      parent
    );
    text.style.fontFamily = hand ? "'Kalam', cursive" : "'Space Grotesk', sans-serif";
    text.textContent = content;
    return text;
  },
};
