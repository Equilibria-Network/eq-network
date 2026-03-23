// Column header — just a label, not a card
import React from 'react';

export default function HeaderNode({ data }: { data: any }) {
  return (
    <div
      style={{
        width: 120,
        padding: '6px 0',
        fontSize: 13,
        fontWeight: 700,
        color: '#003B7E',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.1em',
        textAlign: 'center',
        borderBottom: '2px solid #003B7E',
        userSelect: 'none',
      }}
    >
      {data.label}
    </div>
  );
}
