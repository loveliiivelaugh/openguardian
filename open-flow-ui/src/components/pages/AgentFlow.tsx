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
import { Box, Grid } from '@mui/material';
import { Button, Typography, TextField } from '@mui/material';
// import { Node, Edge } from 'reactflow';
// import { nodeTypes } from '@components/Custom/Agents/staticNodeTypes';
// import { useFlowStore } from '@store/v2/flowStore';
// import { useAgentFlowBuilder } from './useAgentFlowBuilder';
import useUtilityStore from '@store/utilityStore';
import { useSupabaseStore } from '@store/supabaseStore';
import { supabase } from '@api/supabase';
// import NodeConfigDrawer from '@components/Custom/Agents/NodeConfigDrawer';
// import { FlowScriptEditor } from '@components/Custom/forms/premade/FlowScriptEditor';
// import { FlowScriptEditorWithSelection } from '@components/Custom/forms/premade/FlowScriptEditor2';
// import { Chat } from '@components/Custom/Chat';

const AgentFlowCanvas = () => {
    // const { subflowLoading } = useFlowStore();
    const utilityStore = useUtilityStore();
    const { session } = useSupabaseStore();
    // const {
    //     nodes,
    //     edges,
    //     setNodes,
    //     setEdges,
    //     onConnect,
    //     onEdgeClick,
    //     setSelectedNode,
    //     onSave,
    //     flowIdFromUrl,
    //     flowData,
    //     structuredNodes
    // } = useAgentFlowBuilder();

    const onNodeClick = (event: any, node: Node) => {
        // setSelectedNode(node)//TODO: Update to use single source of truth

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

    // const handleNodesChange = (changes: NodeChange[]) => {
    //     setNodes((prev: Node[]) => applyNodeChanges(changes, prev));
    // };

    // const handleEdgesChange = (changes: EdgeChange[]) => {
    //     setEdges((prev: Edge[]) => applyEdgeChanges(changes, prev));
    // };

    // console.log("AgentFlowCanvas", { nodes, edges, flowIdFromUrl, flowData, structuredNodes, nodeTypes });

    return (
        <>
            
            <ReactFlowProvider>
                <Box sx={{
                    height: '90vh',
                    width: '98vw',
                    // height: '70vh',
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    zIndex: 0,
                    pointerEvents: 'auto',
                    position: 'relative',
                }}>

                <Box sx={{ position: 'absolute', top: 2, right: 2 }}>
                    {session && `Signed in as ${session.user.email}`}
                <Button variant="contained" disabled={!session} sx={{ m: 2, bgcolor: "rgba(255, 255, 255, 0.1)", zIndex: 1000, position: 'absolute', top: 2, right: 2 }} onClick={() => utilityStore.setModal({
                    open: true,
                    content: (
                        <Box sx={{ p:2, width: 500 }}>
                            <Typography variant="h6">Sign Out</Typography>
                            <Typography variant="body2">Are you sure you want to sign out?</Typography>
                            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                                <Button variant="contained" onClick={()=>{supabase.auth.signOut()}}>
                                    Sign Out
                                </Button>
                                <Button variant="outlined" onClick={()=>{utilityStore.setModal({open: false})}}>
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    )
                })}>
                    Sign Out
                </Button>
                </Box>

                <Button variant="contained" sx={{ m: 2, bgcolor: "rgba(255, 255, 255, 0.1)", zIndex: 1000, position: 'absolute', top: 2, left: 2 }} onClick={() => utilityStore.setDrawer({
                    open: true,
                    anchor: "left",
                    // content: "prewritten prompts coming soon"
                    content: (
                        <Box sx={{ p:2, width: 500 }}>
                            <Typography variant="h6">Flow Scripts 2</Typography>

                            <TextField
                                label="Flow Script"
                                placeholder='e.g. { "steps": [ { "action": "fetch_data", "params": {...} } ] }'
                                type="textbox"
                                multiline
                                rows={30}
                                fullWidth
                                variant="outlined"
                                // value={raw}
                                // onChange={(e) => setRaw(e.target.value)}
                                sx={{
                                    backgroundColor: "#1C1C1E",
                                    color: "#E0E0E0",
                                    borderRadius: 2,
                                    '& .MuiInputBase-input': { fontFamily: 'monospace', color: '#E0E0E0' },
                                }}
                            />

                            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                                {[
                                    { label: "New Flow" },
                                    { label: "Create Node" },
                                    { label: "Create Edge" },
                                ].map((item) => (
                                    <Button variant="contained" key={item.label} onClick={() => {}}>
                                        {item.label}
                                    </Button>
                                ))}
                            </Box>

                            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                                <Button variant="contained" onClick={()=>{}}>
                                    Validate & Preview
                                </Button>
                                <Button variant="outlined" onClick={()=>{}}>
                                    Convert to AgentFlow
                                </Button>
                                <Button variant="text" onClick={()=>{}}>
                                    Load Example
                                </Button>
                            </Box>
                            
                            {/* 
                            {error && (
                                <Alert severity="error" sx={{ mt: 1 }}>
                                    JSON error: {error}
                                </Alert>
                            )} */}
                        </Box>
                    )
                })}>
                    Flow Scripts
                </Button>

                    <ReactFlow
                        // nodes={nodes}
                        // edges={edges}
                        // onNodesChange={handleNodesChange}
                        // onEdgesChange={handleEdgesChange}
                        // onConnect={onConnect}
                        // onNodeClick={onNodeClick}
                        // onEdgeClick={onEdgeClick}
                        // nodeTypes={nodeTypes}
                        onClick={() => console.log("clicked CANVAS!! ")}
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

                    <Box sx={{ 
                            width: '80%',
                            m: 2, 
                            bgcolor: "rgba(255, 255, 255, 0.1)", 
                            zIndex: 1000, 
                            position: 'absolute', 
                            bottom: 2,
                            ml: 10,
                            // left: 4
                        }}
                    >
                        {/* <Chat
                            // isLoading={agentFlowChatMutation.isPending}
                            // onSubmit={handleChatSubmit}
                        /> */}
                    </Box>
                </Box>
            </ReactFlowProvider>
        </>
    );
};

export default AgentFlowCanvas;
export { AgentFlowCanvas };