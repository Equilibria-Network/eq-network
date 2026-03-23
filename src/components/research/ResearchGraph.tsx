// src/components/research/ResearchGraph.tsx
// Interactive research tech tree with full-screen card detail on click.

import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import HeaderNode from './nodes/PhaseNode';
import CardNode from './nodes/SubAreaNode';
import ApplyNode from './nodes/ApplyNode';
import LeafNode from './nodes/LeafNode';
import RowLabelNode from './nodes/RowLabelNode';
import DirectEdge from './nodes/DirectEdge';
import CardModal from './CardModal';
import { buildGraph, CARDS } from './graphData';
import styles from './ResearchGraph.module.css';

const nodeTypes = {
  header: HeaderNode,
  card: CardNode,
  apply: ApplyNode,
  leaf: LeafNode,
  rowlabel: RowLabelNode,
};

const edgeTypes = {
  direct: DirectEdge,
};

export default function ResearchGraph() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const { nodes: graphNodes, edges: graphEdges } = useMemo(
    () => buildGraph(2, new Set()),
    []
  );

  const [nodes, , onNodesChange] = useNodesState(graphNodes);
  const [edges, , onEdgesChange] = useEdgesState(graphEdges);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      // Only open modal for card and apply nodes
      const card = CARDS.find((c) => c.id === node.id);
      if (card) {
        setSelectedCard(node.id);
      }
    },
    []
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <p className={styles.subtitle}>
          Click any card to learn more.
        </p>
      </div>

      <div className={styles.canvas}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          minZoom={0.3}
          maxZoom={2}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
          proOptions={{ hideAttribution: true }}
        />
      </div>

      {/* Mobile fallback: simple stacked list */}
      <div className={styles.mobileList}>
        {['Foundations', 'Construction', 'Simulation', 'Validation'].map((phase, ci) => {
          const phaseCards = CARDS.filter((c) => c.col === ci);
          if (phaseCards.length === 0) return null;
          return (
            <div key={ci} className={styles.mobilePhase}>
              <h3 className={styles.mobilePhaseTitle}>{phase}</h3>
              {phaseCards.map((card) => (
                <button
                  key={card.id}
                  className={`${styles.mobileCard} ${card.type === 'apply' ? styles.mobileApply : ''}`}
                  onClick={() => setSelectedCard(card.id)}
                >
                  <span className={styles.mobileCardLabel}>{card.label}</span>
                  <span className={styles.mobileCardDesc}>{card.description}</span>
                </button>
              ))}
            </div>
          );
        })}
      </div>

      {selectedCard && (
        <CardModal
          cardId={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}
