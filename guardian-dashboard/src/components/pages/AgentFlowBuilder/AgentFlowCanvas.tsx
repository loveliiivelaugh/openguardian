// import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    ReactFlowProvider,
    applyNodeChanges,
    applyEdgeChanges,
    Node,
    Edge,
    NodeChange,
    EdgeChange
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Box } from '@mui/material';
// import { Node, Edge } from 'reactflow';
import { nodeTypes } from '@components/Custom/Agents/staticNodeTypes';
import { useFlowStore } from '@store/v2/flowStore';
import { useAgentFlowBuilder } from './useAgentFlowBuilder';
import useUtilityStore from '@store/utilityStore';
import NodeConfigDrawer from '@components/Custom/Agents/NodeConfigDrawer';

const AgentFlowCanvas = () => {
    const { subflowLoading } = useFlowStore();
    const utilityStore = useUtilityStore();
    const {
        nodes,
        edges,
        setNodes,
        setEdges,
        onConnect,
        onEdgeClick,
        setSelectedNode,
        onSave,
        flowIdFromUrl,
        flowData,
        structuredNodes
    } = useAgentFlowBuilder();

    const onNodeClick = (event: any, node: Node) => {
        setSelectedNode(node)//TODO: Update to use single source of truth

        // utilityStore.setDrawer({
        //     open: true,
        //     anchor: "right",
        //     // @ts-ignore
        //     boxStyle: { width: 560 },
        //     content: (
        //         <NodeConfigDrawer
        //             node={node as any}
        //             onSave={onSave}
        //             flow={flowData.find(({ id }: { id: string }) => (id === flowIdFromUrl))}
        //         />
        //     )
        // })
    };


    const handleNodesChange = (changes: NodeChange[]) => {
        setNodes((prev: Node[]) => applyNodeChanges(changes, prev));
    };

    const handleEdgesChange = (changes: EdgeChange[]) => {
        setEdges((prev: Edge[]) => applyEdgeChanges(changes, prev));
    };

    console.log("AgentFlowCanvas", { nodes, edges, flowIdFromUrl, flowData, structuredNodes, nodeTypes });

    return (
        <>
            <ReactFlowProvider>
                <Box sx={{
                    height: '70vh',
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    zIndex: 0,
                    pointerEvents: 'auto',
                    position: 'relative',
                }}>
                    {subflowLoading && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 1000,
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            color: '#fff',
                            fontSize: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'none'
                        }}>
                            🔄 Loading linked flows...
                        </div>
                    )}
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={handleNodesChange}
                        onEdgesChange={handleEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        onEdgeClick={onEdgeClick}
                        nodeTypes={nodeTypes}
                        nodesDraggable
                        nodesConnectable
                        elementsSelectable
                        fitView
                        style={{ width: '100%', height: '100vh', pointerEvents: 'auto' }}
                    >
                        <Background />
                        <Controls style={{ background: "transparent" }} />
                        <MiniMap style={{ background: "transparent" }} />
                    </ReactFlow>
                </Box>
            </ReactFlowProvider>
        </>
    );
};

export default AgentFlowCanvas;
export { AgentFlowCanvas };