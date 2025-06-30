import { AgentNode, FunctionNode, TriggerNode } from "./NodeTypes";
import { NodeLayout } from "./NodeLayout";

const nodeTypesLayout = {
    agent: NodeLayout,
    function: NodeLayout,
    default: NodeLayout,
    trigger: NodeLayout,
    action: NodeLayout,
    condition: NodeLayout,
    memory: NodeLayout,
    schedule: NodeLayout,
    wait: NodeLayout,
    log: NodeLayout,
    github: NodeLayout,
    http: NodeLayout,
    slack: NodeLayout,
    llm: NodeLayout,
    webhook: NodeLayout,
    integration: NodeLayout
}
export const nodeTypes = {
    agent: AgentNode,
    function: FunctionNode,
    default: FunctionNode,
    trigger: TriggerNode,
    // New ones — create custom components as needed
    action: FunctionNode,
    condition: FunctionNode,
    memory: AgentNode,
    schedule: FunctionNode,
    wait: FunctionNode,
    log: FunctionNode,
    github: FunctionNode,
    http: FunctionNode,
    slack: FunctionNode,
    llm: AgentNode,
    webhook: FunctionNode,
    integration: FunctionNode,
    // ...nodeTypesLayout
};