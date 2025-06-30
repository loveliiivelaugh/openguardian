import { Node, Edge } from 'reactflow';
// import { AgentFlowStep } from '@components/Custom/Agents/flow-schema';
interface AgentFlowStep {
    [key: string]: any
}

// Utility to build execution plan from graph
export function createFlowExecutionPlan(
    nodes: Node[],
    edges: Edge[]
): AgentFlowStep[] {
    const stepsMap: Record<string, AgentFlowStep> = {};
    const connectionsMap: Record<string, string[]> = {};

    // Step 1: Build initial step map
    for (const node of nodes) {
        const step: AgentFlowStep = {
            id: node.id,
            type: node.data.type,
            run: node.data.run || 'noop',
            args: node.data.args || {},
            label: node.data.label || node.data.type,
            config: node.data.config || {},
        };
        stepsMap[node.id] = step;
        connectionsMap[node.id] = []; // Initialize connection map
    }

    // Step 2: Build connection map
    for (const edge of edges) {
        if (!connectionsMap[edge.source]) connectionsMap[edge.source] = [];
        connectionsMap[edge.source].push(edge.target);
    }

    // Step 3: Add "next" to each step based on graph edges
    for (const [sourceId, targets] of Object.entries(connectionsMap)) {
        const step = stepsMap[sourceId];
        if (targets.length === 1) {
            step.next = targets;
        } else if (targets.length > 1) {
            // Support branching later (e.g. conditionals)
            step.next = targets;
        }
    }

    // Step 4: Sort into execution order (starting from a Trigger)
    const visited = new Set<string>();
    const sortedSteps: AgentFlowStep[] = [];

    function dfs(currentId: string) {
        if (visited.has(currentId)) return;
        visited.add(currentId);
        const step = stepsMap[currentId];
        if (!step) return;
        sortedSteps.push(step);
        const next = step.next || [];
        for (const nextId of next) {
            dfs(nextId);
        }
    }

    // Step 5: Find root nodes (trigger or no inputs)
    const rootNodes = nodes.filter((node) => {
        const isTrigger = node.type === 'trigger' || node.data.type === 'trigger';
        const hasNoIncoming = !edges.find((e) => e.target === node.id);
        return isTrigger || hasNoIncoming;
    });

    for (const root of rootNodes) {
        dfs(root.id);
    }

    return sortedSteps;
}
