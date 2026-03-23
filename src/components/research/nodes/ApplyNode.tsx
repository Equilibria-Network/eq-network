// Apply node — aspirational/forward-looking, lighter styling
import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function ApplyNode({ data }: { data: any }) {
  return (
    <div
      style={{
        width: 260,
        height: 72,
        background: '#f8f9fb',
        border: '1.5px dashed #003B7E25',
        borderLeft: '4px solid #4AB3F4',
        borderRadius: 6,
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        opacity: 0.75,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 600, color: '#003B7E', marginBottom: 4 }}>
        {data.label}
      </div>
      <div style={{ fontSize: 10, color: '#888', lineHeight: 1.45, fontStyle: 'italic' }}>
        {data.description}
      </div>
      <Handle id="left" type="target" position={Position.Left} style={{ background: '#4AB3F4', width: 6, height: 6, border: '2px solid #f8f9fb' }} />
    </div>
  );
}
