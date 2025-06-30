import { useFlowStore } from "@store/v2/flowStore";
import { Node, Edge } from "reactflow";
import { supabase } from "@api/supabase";
import { generateEdgesFromSequentialNodes } from "./generateEdgesFromSequentialNodes";

export async function loadSubFlowForNode(nodeId: string, flowId: string) {
    const { data, error } = await supabase
        .from('agent_flows')
        .select('*')
        .eq('id', flowId)
        .single();

    if (error) {
        console.error('❌ Failed to load subflow:', error);
        return;
    }

    let rawNodes: Node[] = data.nodes || [];
    let rawEdges: Edge[] = data.edges || [];

    console.log("🔌 Raw nodes and edges:", rawNodes, rawNodes.length, (rawNodes?.steps), Array.isArray(rawNodes.steps), rawEdges);

    // 🧠 Fallback: if flow only has steps, convert it into nodes + edges
    if ((rawNodes?.steps) && Array.isArray(rawNodes.steps)) {
        console.log("🔌 Fallback to steps for subflow:", rawNodes.steps);
        const plan = rawNodes.steps;
        const canvasNodes: Node[] = plan.map((step: any, i: number) => ({
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

        const canvasEdges: Edge[] = plan.flatMap((step: any) => {
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

        rawNodes = canvasNodes;
        rawEdges = canvasEdges;
    }

    console.log("🔌 Final nodes and edges:", rawNodes, rawEdges);

    // Prefix IDs for safe namespacing
    const subflowNodes: Node[] = rawNodes.map((n: Node, i: number) => ({
        ...n,
        id: `${nodeId}__${n.id}`,
        position: {
            x: (n.position?.x || 0) + 300,
            y: (n.position?.y || 0) + 150 + i * 120,
        },
        parentNode: nodeId,
        data: {
            ...n.data,
            label: n.data?.label || n.id,
            type: n.data?.type || 'function',
            config: n.data?.config || {},
        }
    }));

    const subflowEdges: Edge[] = rawEdges.map((e: Edge) => ({
        ...e,
        id: `${nodeId}__${e.id}`,
        source: `${nodeId}__${e.source}`,
        target: `${nodeId}__${e.target}`,
    }));

    // Create an edge from the agent node ➝ first subflow node
    const firstNode = subflowNodes[0];
    if (firstNode) {
        const connectorEdge: Edge = {
            id: `${nodeId}__connect__${firstNode.id}`,
            source: nodeId,
            target: firstNode.id,
            type: 'bezier',
            animated: true,
            style: { stroke: '#888' },
            markerEnd: {
                type: 'arrowclosed',
                width: 20,
                height: 20
            }
        };

        subflowEdges.unshift(connectorEdge); // Add it first in the edge list
    }

    const allEdges = [...subflowEdges, ...generateEdgesFromSequentialNodes(subflowNodes)];

    const { setNodes, setEdges } = useFlowStore.getState();

    setNodes((prev) => [...prev, ...subflowNodes]);
    setEdges((prev) => [...prev, ...allEdges]);

    console.log(`🔁 Subflow loaded for node ${nodeId}:`, subflowNodes.length, 'nodes');
}
