import { Node, Edge } from 'reactflow';
import { AgentFlowStep } from '@utilities/../types/flowSchema';

export function stepsToCanvas(steps: AgentFlowStep[]): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodes: Node[] = steps.map((step, i) => ({
    id: step.id,
    position: { x: i * 200, y: i * 120 },
    type: step.type || 'function',
    data: {
      label: step.label || step.id,
      type: step.type,
      run: step.run,
      args: step.args || {},
      config: step.config || {},
    },
  }));

  const edges: Edge[] = steps.flatMap((step: AgentFlowStep) => {
    if (!step.next || step.next.length === 0) return [];
    return step.next.map((nextId: string) => ({
      id: `${step.id}→${nextId}`,
      source: step.id,
      target: nextId,
      animated: true,
      type: 'bezier',
      style: { stroke: '#9b5de5' },
      markerEnd: {
        type: 'arrowclosed',
        width: 20,
        height: 20,
      },
    }));
  });

  return { nodes, edges };
}
