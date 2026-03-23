import React from 'react';

export default function RowLabelNode({ data }: { data: any }) {
  return (
    <div
      style={{
        width: 130,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        fontSize: 11,
        fontWeight: 700,
        color: '#003B7E',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.08em',
        opacity: 0.5,
        userSelect: 'none',
      }}
    >
      {data.label}
    </div>
  );
}
