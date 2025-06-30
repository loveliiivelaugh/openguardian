export function convertAgentFlowToCanvasNodes(flow: Record<string, any>) {
    console.log("convertAgentFlowToCanvasNodes: ", flow)
    return Object.entries(flow).map(([id, node]) => ({
        id,
        type: node.type || "default",
        position: node.position || { x: 0, y: 0 },
        data: {
            ...node.data,
            id,
            next: node.next,
            type: node.data?.type || "function",
            label: node.data?.label || node.data?.name || "Untitled"
        }
    }));
}

export function getEdgesFromAgentFlow(flow: Record<string, any>) {
    return Object.entries(flow).flatMap(([sourceId, node]) =>
        (node.next || []).map((targetId: string) => ({
            id: `e-${sourceId}-${targetId}`,
            source: sourceId,
            target: targetId,
            animated: true,
            style: {
                stroke: "#9f6aff",
                strokeWidth: 2
            },
            markerEnd: {
                type: "arrowclosed"
            }
        }))
    );
}
