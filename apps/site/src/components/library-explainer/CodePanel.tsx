import type { ReactNode } from 'react';
import { manifest, snippets } from './fixtures';

const REPO = 'https://github.com/eq-network/Collective-Intelligence-Library';

/** The code, drawn: snippets are marker-extracted at export time
    (snippets.json), never pasted by hand — and rendered as a graphical view
    rather than plain text. Declared effects get the page's shared visual
    vocabulary: field names inside reads=[...] wear the read chip, fields
    inside writes=[...] wear the write chip, so the code panel and the scene
    beside it are recognisably the same object. */

type Mode = 'read' | 'write' | null;

function renderLine(line: string, mode: Mode, key: number): { node: ReactNode; mode: Mode } {
  if (/\bdef\s/.test(line)) mode = null;
  const parts = line.split(/(reads=|writes=|'[^']*'|"[^"]*")/g);
  const nodes: ReactNode[] = [];
  parts.forEach((part, index) => {
    if (part === 'reads=') {
      mode = 'read';
      nodes.push(
        <span key={index} className="libx-code-marker libx-code-marker-read">
          {part}
        </span>
      );
    } else if (part === 'writes=') {
      mode = 'write';
      nodes.push(
        <span key={index} className="libx-code-marker libx-code-marker-write">
          {part}
        </span>
      );
    } else if (mode && /^['"]/.test(part)) {
      nodes.push(
        <span key={index} className={`libx-effect libx-effect-${mode} libx-code-field`}>
          {part.slice(1, -1)}
        </span>
      );
    } else if (part.includes('@transform')) {
      const [before, after] = part.split('@transform');
      nodes.push(
        <span key={index}>
          {before}
          <span className="libx-code-decorator">@transform</span>
          {after}
        </span>
      );
    } else if (part) {
      nodes.push(part);
    }
  });
  return { node: <div key={key}>{nodes.length ? nodes : ' '}</div>, mode };
}

export default function CodePanel({ snippetId }: { snippetId?: string }) {
  const snippet = snippetId ? snippets[snippetId] : undefined;
  if (!snippet) return null;

  const blobUrl =
    `${REPO}/blob/${manifest.engine.git_rev}/${snippet.path}` +
    `#L${snippet.start_line}-L${snippet.end_line}`;

  const lines: ReactNode[] = [];
  let mode: Mode = null;
  snippet.text.split('\n').forEach((line, index) => {
    const rendered = renderLine(line, mode, index);
    lines.push(rendered.node);
    mode = rendered.mode;
  });
  const hasEffects = /reads=|writes=/.test(snippet.text);

  return (
    <details className="libx-codepanel" open>
      <summary>the code — {snippet.path.split('/').pop()}</summary>
      {hasEffects && (
        <p className="libx-codepanel-legend" aria-hidden="true">
          <span className="libx-effect libx-effect-read libx-code-field">field it reads</span>
          <span className="libx-effect libx-effect-write libx-code-field">field it writes</span>—
          the same chips as the diagrams
        </p>
      )}
      <pre>
        <code>{lines}</code>
      </pre>
      <p className="libx-codepanel-footer">
        {snippet.path} · lines {snippet.start_line}–{snippet.end_line} · engine{' '}
        {manifest.engine.version} @{' '}
        <a href={blobUrl} target="_blank" rel="noreferrer">
          {manifest.engine.git_rev}
        </a>
      </p>
    </details>
  );
}
