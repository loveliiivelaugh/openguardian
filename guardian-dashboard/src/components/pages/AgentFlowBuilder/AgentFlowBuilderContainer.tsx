import { Box, Button, Grid, Stack, TextField, Typography } from '@mui/material';
import { Node } from 'reactflow';
import { useAgentFlowBuilder } from './useAgentFlowBuilder';
import { useState } from 'react';
import Tabs from '@components/Mui/Tabs';
import NodeConfigDrawer from '@components/Custom/Agents/NodeConfigDrawer';
import { TerminalLogScroller } from '@components/Custom/Agents/TerminalLogScroller';
import MemorySphere5 from '@components/Custom/Agents/Builder/MemorySphere5';
import AgentFlowKanbanPage from '../Kanban/Kanban';
import AgentAvatar from '@components/Custom/Agents/Builder/AgentBuilderScene';
import { Chat } from '@components/Custom/Chat';
import AgentFlowCanvas from './AgentFlowCanvas';
import EditorButtons from './EditorButtons/EditorButtons';
import { useSupabaseStore, useUtilityStore } from '@store/index';
import { useWebSocketStore } from '@hooks/useWebsocket';
import { EngineHUD } from '@components/Custom/Agents/EngineHUD';
import LoadFlowModal from '@components/Custom/Agents/LoadFlowModal';
import AnalyticsDashboard from '../Analytics/AnalyticsDashboard';
import { IntegrationFeed } from '../IntegrationFeed/IntegrationFeed';
import PrewrittenPrompts from '@components/Custom/Agents/PrewrittenPrompts';

const AgentFlowBuilderContainer = () => {
    const [activeTab, setActiveTab] = useState(0);
    const { logs } = useWebSocketStore();
    const utilityStore = useUtilityStore();
    const agentFlowBuilderHook = useAgentFlowBuilder();
    const auth = useSupabaseStore();

    const {
        flowIdFromUrl,
        flowData,
        agentFlowChatMutation,
        setSelectedNode,
        flowName,
        onSave,
        handleChatSubmit,
        handleUpdateFlowName
    } = agentFlowBuilderHook;

    const onNodeClick = (event: any, node: Node) => {
        setSelectedNode(node.id);

        // const selectedFlow = flowData.find(({ id }: { id: string }) => id === flowIdFromUrl);
        // utilityStore.setDrawer({
        //     open: true,
        //     anchor: "right",
        //     // @ts-ignore
        //     boxStyle: { width: 560 },
        //     content: (
        //         <NodeConfigDrawer
        //             node={node as any}
        //             onSave={onSave}
        //             flow={selectedFlow}
        //         />
        //     )
        // })
    };

    const loadFlow = (loadDefaultEngineFlow: (defaultEngineFlowKey: string) => void) => {
        utilityStore.setModal({
            open: true,
            sx: {
                slots: {
                    box: {
                        borderRadius: "24px",
                        backgroundColor: '#1C1C1E',
                        color: '#E0E0E0',
                        width: 700
                    }
                }
            },
            content: <LoadFlowModal flowData={flowData} loadDefaultEngineFlow={loadDefaultEngineFlow} />
        })
    };

    return (
        <>
        {activeTab === 0 && (
            <Box sx={{ position: 'absolute', width: '97vw', height: '100vh', overflow: 'hidden'}}>
                <AgentFlowCanvas />
            </Box>
        )}
        <Grid container sx={{ height: '100vh' }}>
            {/* Agent Flow Builder view */}
            {activeTab === 0 && (
                <>
                    <Grid size={12}>
                        <Stack spacing={2} sx={{ p:2, width: "16%" }}>
                            <TextField
                                component={Typography}
                                label="Flow Name"
                                value={flowName}
                                onChange={handleUpdateFlowName}
                            />
                            <Button variant="contained" onClick={() => utilityStore.setDrawer({
                                open: true,
                                anchor: "left",
                                // content: "prewritten prompts coming soon"
                                content: <PrewrittenPrompts />
                            })}>
                                Prewritten Prompts
                            </Button>
                        </Stack>
                    </Grid>
                    <Box sx={{ height: '52vh' }}></Box>
                    <Grid size={12} sx={{ mt: 8, px: 8, mb: -16 }}>
                        <EditorButtons setActiveTab={setActiveTab} />
                        <Box sx={{m:2}} />
                        <Chat
                            isLoading={agentFlowChatMutation.isPending}
                            onSubmit={handleChatSubmit}
                        />
                    </Grid>
                </>
            )}

            {/* Agent Viewer view */}
            {activeTab === 1 && (
                <Grid container sx={{ height: "70vh", maxHeight: "100vh" }}>
                    <Grid size={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                            Orchestration Engine Terminal
                        </Typography>
                        <Box sx={{ border: '1px solid #ada', p: 2, borderRadius: 2 }}>
                            <TerminalLogScroller logStream={logs} />
                        </Box>
                    </Grid>
                    <Grid size={6}>
                        <MemorySphere5 />
                    </Grid>
                    <Grid size={12}>
                        <AgentFlowKanbanPage />
                    </Grid>
                    <Grid size={12} sx={{ marginTop: "-260px", zIndex: -1000 }}>
                        <AgentAvatar
                            onAgentClick={onNodeClick}
                            type="dev-agent"
                            animationState="idle"
                            position={[0, -1, 0]}
                            scale={1}
                            spin={false}
                        />
                    </Grid>
                </Grid>
            )}

            {/* Engine HUD view */}
            {activeTab === 2 && (
                <EngineHUD loadNewFlow={loadFlow} />
            )}

            {/* Analytics view */}
            {activeTab === 3 && (
                <AnalyticsDashboard />
            )}

            {/* Integrations Feed */}
            {activeTab === 4 && (
                <IntegrationFeed />
            )}

            <Grid size={12}>
                <Tabs
                    tabs={[
                        { label: "AgentFlow Builder" },
                        { label: "Agent Viewer" },
                        { label: "Engine HUD" },
                        { label: "Analytics" },
                        { label: "Integration Feed" }
                    ]}
                    onChange={(index: number) => setActiveTab(index)}
                />
            </Grid>
        </Grid>
        </>
    )
};

export default AgentFlowBuilderContainer;