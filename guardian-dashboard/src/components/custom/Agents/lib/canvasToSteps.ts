import { Node, Edge } from 'reactflow';
import { AgentFlowStep } from '@utilities/../types/flowSchema';

// 🔄 Convert canvas into executable AgentPlan steps
export function canvasToSteps(nodes: Node[], edges: Edge[]): AgentFlowStep[] {
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    const adjacency: Record<string, string[]> = {};

    edges.forEach((e) => {
        if (!adjacency[e.source]) {
            adjacency[e.source] = [];
        }
        adjacency[e.source].push(e.target);
    });

    const steps: AgentFlowStep[] = nodes.map((node) => {
        const step: AgentFlowStep = {
            id: node.id,
            run: node.data?.run || 'noop',
            // @ts-ignore
            type: node.type || 'function',
            args: node.data?.args || {},
            config: node.data?.config || {},
            label: node.data?.label || node.id,
            next: adjacency[node.id] || [],
        };
        return step;
    });

    return steps;
}
