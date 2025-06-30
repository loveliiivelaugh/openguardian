// utilities/flows/flowHelpers.ts
import { Node, Edge } from 'reactflow';

// 🔗 Automatically connect nodes if they have no edges
export function ensureSequentialEdges(nodes: Node[], existingEdges: Edge[]): Edge[] {
  const edges: Edge[] = [...existingEdges];

  const connectedTargets = new Set(edges.map(e => e.target));
  const sortedNodes = [...nodes].sort((a, b) => a.position.y - b.position.y);

  for (let i = 0; i < sortedNodes.length - 1; i++) {
    const current = sortedNodes[i];
    const next = sortedNodes[i + 1];

    if (!connectedTargets.has(current.id)) {
      edges.push({
        id: `${current.id}→${next.id}`,
        source: current.id,
        target: next.id,
        type: 'bezier',
        animated: true,
        style: { stroke: '#9b5de5' },
        markerEnd: {
            // @ts-ignore
          type: 'arrowclosed',
          width: 20,
          height: 20,
        },
      });
    }
  }

  return edges;
}