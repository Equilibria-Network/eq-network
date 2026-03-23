import React from 'react';
import { Handle, Position } from '@xyflow/react';

const STATUS_COLORS: Record<string, string> = {
  published: '#003B7E',
  active: '#0055C4',
  draft: '#4AB3F4',
  concept: '#99b',
};

export default function LeafNode({ data }: { data: any }) {
  const hasLink = !!data.link;

  return (
    <div
      style={{
        width: 200,
        height: 38,
        background: '#f8f9fb',
        border: '1px solid #003B7E18',
        borderRadius: 5,
        padding: '7px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: hasLink ? 'pointer' : 'default',
      }}
      onClick={() => {
        if (hasLink) window.open(data.link, '_blank', 'noopener,noreferrer');
      }}
    >
      {data.status && (
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: STATUS_COLORS[data.status] || '#ccc',
            flexShrink: 0,
          }}
        />
      )}
      <span
        style={{
          fontSize: 11,
          color: hasLink ? '#003B7E' : '#444',
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap' as const,
          textDecoration: hasLink ? 'underline' : 'none',
        }}
      >
        {data.label}
      </span>
      {hasLink && (
        <span style={{ fontSize: 10, color: '#003B7E', flexShrink: 0, marginLeft: 'auto' }}>↗</span>
      )}
      <Handle id="left" type="target" position={Position.Left} style={{ background: '#003B7E', width: 4, height: 4, opacity: 0.3 }} />
    </div>
  );
}
