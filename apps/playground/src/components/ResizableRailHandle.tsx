import { useEffect, useRef } from 'react';

interface ResizableRailHandleProps {
  label: string;
  max: number;
  min: number;
  onChange: (width: number) => void;
  resetValue: number;
  side: 'left' | 'right';
  value: number;
}

interface DragState {
  pointerId: number;
  startWidth: number;
  startX: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}

export default function ResizableRailHandle({
  label,
  max,
  min,
  onChange,
  resetValue,
  side,
  value,
}: ResizableRailHandleProps) {
  const dragState = useRef<DragState | null>(null);

  useEffect(
    () => () => {
      document.body.classList.remove('is-resizing-rail');
    },
    []
  );

  const finishDrag = (element: HTMLDivElement, pointerId: number) => {
    if (dragState.current?.pointerId !== pointerId) return;
    dragState.current = null;
    document.body.classList.remove('is-resizing-rail');
    if (element.hasPointerCapture(pointerId)) element.releasePointerCapture(pointerId);
  };

  return (
    <div
      aria-label={label}
      aria-orientation="vertical"
      aria-valuemax={max}
      aria-valuemin={min}
      aria-valuenow={value}
      className={`rail-resizer rail-resizer-${side}`}
      data-side={side}
      onDoubleClick={() => onChange(resetValue)}
      onKeyDown={(event) => {
        const step = event.shiftKey ? 48 : 16;
        const direction = side === 'left' ? 1 : -1;
        if (event.key === 'Home') {
          event.preventDefault();
          onChange(min);
        } else if (event.key === 'End') {
          event.preventDefault();
          onChange(max);
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault();
          onChange(clamp(value - step * direction, min, max));
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          onChange(clamp(value + step * direction, min, max));
        }
      }}
      onPointerCancel={(event) => finishDrag(event.currentTarget, event.pointerId)}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        dragState.current = {
          pointerId: event.pointerId,
          startWidth: value,
          startX: event.clientX,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
        document.body.classList.add('is-resizing-rail');
      }}
      onLostPointerCapture={(event) => finishDrag(event.currentTarget, event.pointerId)}
      onPointerMove={(event) => {
        const drag = dragState.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        const direction = side === 'left' ? 1 : -1;
        onChange(clamp(drag.startWidth + (event.clientX - drag.startX) * direction, min, max));
      }}
      onPointerUp={(event) => finishDrag(event.currentTarget, event.pointerId)}
      role="separator"
      tabIndex={0}
      title={`${label}. Drag, use arrow keys, or double-click to reset.`}
    />
  );
}
