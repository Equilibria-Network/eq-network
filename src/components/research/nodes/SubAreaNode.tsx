// Card node — the main tech tree node for Foundations, Build, and Test columns
import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function CardNode({ data }: { data: any }) {
  const isActive = data.status === 'active' || data.status === 'early';

  return (
    <div
      style={{
        width: 260,
        height: 72,
        background: '#fff',
        border: `1.5px solid ${isActive ? '#003B7E40' : '#003B7E18'}`,
        borderLeft: `4px solid ${isActive ? '#003B7E' : '#003B7E50'}`,
        borderRadius: 6,
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxShadow: isActive ? '0 2px 8px rgba(0,59,126,0.08)' : 'none',
        cursor: 'pointer',
        opacity: isActive ? 1 : 0.6,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 600, color: '#003B7E', marginBottom: 4 }}>
        {data.label}
      </div>
      <div style={{ fontSize: 10, color: '#666', lineHeight: 1.45 }}>
        {data.description}
      </div>
      <Handle id="left" type="target" position={Position.Left} style={{ background: '#003B7E', width: 6, height: 6, border: '2px solid #fff' }} />
      <Handle id="right" type="source" position={Position.Right} style={{ background: '#003B7E', width: 6, height: 6, border: '2px solid #fff' }} />
    </div>
  );
}
