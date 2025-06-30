import { Edge, Node } from 'reactflow';

export function generateEdgesFromSequentialNodes(nodes: Node[]): Edge[] {
    const edges: Edge[] = [];

    if (nodes?.steps) nodes = nodes.steps;
    if (!nodes) return [];
    // sort nodes by y or x position (optional fallback)
    const sorted = [...nodes].sort((a, b) => a.position.y - b.position.y);

    for (let i = 0; i < sorted.length - 1; i++) {
        const current = sorted[i];
        const next = sorted[i + 1];

        // Skip if types don't match your logic or already connected
        if (!current || !next) continue;

        const edgeExists = edges.find((e) => e.source === current.id && e.target === next.id);
        if (edgeExists) continue;

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
                height: 20
            }
        });
    }

    return edges;
}
