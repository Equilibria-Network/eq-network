// A simple straight line edge — no routing, no curves, just source to target.
import React from 'react';
import { BaseEdge, type EdgeProps } from '@xyflow/react';

export default function DirectEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  style,
}: EdgeProps) {
  const path = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;

  return <BaseEdge path={path} markerEnd={markerEnd} style={style} />;
}
