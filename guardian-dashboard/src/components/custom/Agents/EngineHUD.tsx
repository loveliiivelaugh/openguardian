import { useEffect, useState } from 'react';
import { supabase } from '@api/supabase';
import { Card, CardContent, Typography, LinearProgress, Box, Chip, Button, Grid, ListItemButton, Checkbox, List, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';
import { useAppStore, useUtilityStore } from '@store/index';
import { useQuery } from '@tanstack/react-query';
import { queries } from '@api/index';
// TILE IMPORTS
import HeartbeatTile from "./tiles/HeartbeatTile";
import AgentsTile from "./tiles/AgentsTile";
import TasksTile from "./tiles/TasksTile";
import AutomationsTile from "./tiles/AutomationsTile";
import LLMUsageTile from "./tiles/LLMUsageTile";
import MemoryTile from "./tiles/MemoryTile";
import { TerminalLogScroller } from './TerminalLogScroller';
import { useMutation } from "@tanstack/react-query";
import { useWebSocketStore } from '@hooks/useWebsocket';
import { useNavigate } from 'react-router';
import { useCountdown } from '@hooks/useCountdown';
import LoadFlowModal from './LoadFlowModal';
import { useAgentFlowBuilder } from '@components/pages/AgentFlowBuilder/useAgentFlowBuilder';
import FormContainer from '../forms/FormContainer';

type EngineStatus = {
    id: string;
    current_flow_id: string | null;
    current_step_id: string | null;
    current_step_number: number | null;
    total_steps: number | null;
    status: 'idle' | 'running' | 'paused' | 'waiting' | 'error' | 'complete';
    last_updated: string;
};

const DefaultFlowLabel = ({ flowId }: { flowId: string }) => {
    const navigate = useNavigate();
    const flowDataQuery = useQuery(queries.query("/database/read_db/agent_flows"));
    const [flowData] = flowDataQuery?.data?.data.filter((flow: { id: string }) => flow.id === flowId);
    console.log("FLOWDATA: ", flowData);
    return (
        <ListItemButton onClick={() => navigate('/builder?flowId=' + flowId)}>
            {flowData?.name} · {flowId}
        </ListItemButton>
    )
}

export function EngineHUD() {
    const utilityStore = useUtilityStore();
    const { wsStatus, logs, lastMessage } = useWebSocketStore();
    console.log("Terminal Log", logs, lastMessage);
    let { engineStatus: engineStatusUpdate } = useAppStore();
    const pauseQuery = useMutation(queries.mutate("/api/v1/guardian/orchestrator/pause"))
    const startQuery = useMutation(queries.mutate("/api/v1/guardian/orchestrator/start"))
    const orchestratorSettingsMutation = useMutation(queries.mutate("/database/write?table=orchestrator_settings"))
    const orchestratorSettingsQuery = useQuery(queries.query("/database/read_db/orchestrator_settings"));
    const [orchestratorSettings] = orchestratorSettingsQuery?.data?.data;
    const [engineStatus, setEngineStatus] = useState<EngineStatus | null>(null);
    const { flowData } = useAgentFlowBuilder();

    const [showLogs, setShowLogs] = useState<string[]>([]);
    useEffect(() => {setShowLogs(prev => [...prev, lastMessage?.log || ""])}, [lastMessage])

    const countdown = useCountdown(engineStatusUpdate?.next_run_at || null);

    console.log("ENGINESTATUS: ", engineStatus, logs, wsStatus, lastMessage)
    console.log("ENGINESTATUSUPDATE: ", engineStatus, engineStatusUpdate, orchestratorSettings);
    useEffect(() => {
        const fetchEngineStatus = async () => {
            const { data, error } = await supabase
                .from('engine_status')
                .select('*')
                .eq('id', 'ed411d1d-ecb6-4125-a928-3ad00c09c3ea') //TODO: tie this to 
                .single();
            if (data) setEngineStatus(data);
            const { data: flowData } = await supabase
                .from('agent_flows')
                .select('*')
                .eq('id', orchestratorSettings?.fallback_loop_flow_id)
                .single();
            if (flowData) setEngineStatus({ ...data, fallbackLoopFlow: flowData });
            const { data: onEventFlowData } = await supabase
                .from('agent_flows')
                .select('*')
                .eq('id', orchestratorSettings?.on_event_flow_id)
                .single();
            if (onEventFlowData) setEngineStatus({ ...data, fallbackLoopFlow: flowData, onEventFlow: onEventFlowData });
        };
        fetchEngineStatus();

    }, [engineStatusUpdate]);

    if (!engineStatus) {
        return (
            <Card sx={{ p: 2, backgroundColor: 'background.paper' }}>
                <CardContent>
                    <Typography variant="h6">Loading Engine Status...</Typography>
                </CardContent>
            </Card>
        );

    }
    const loadDefaultEngineFlow = async (defaultEngineFlowKey: string, flowId: string) => {
        console.log("defaultEngineFlowKey", defaultEngineFlowKey)
        const { data, error } = await supabase
            .from('orchestrator_settings')
            .update({ [defaultEngineFlowKey]: flowId })
            // TODO: Get this orchestrator_settings ID from a default config in state at load by user
            .eq('id', "35f9f3ab-a0a4-45fb-a483-4b2679216d6d");

        if (error) {
            console.error("Error updating orchestrator settings:", error);
            utilityStore.createAlert("error", "Failed to update orchestrator settings");
            return;
        }
        else {
            utilityStore.createAlert("success", "Successfully updated orchestrator settings");
            orchestratorSettingsQuery.refetch();
        }
    }

    const {
        current_flow_id,
        current_step_id,
        current_step_number,
        total_steps,
        status
    } = engineStatus;

    const progress = current_step_number && total_steps
        ? (current_step_number / total_steps) * 100
        : 0;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'running':
                return 'success';
            case 'paused':
                return 'warning';
            case 'waiting':
                return 'info';
            case 'error':
                return 'error';
            case 'complete':
                return 'primary';
            default:
                return 'default';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ height: "80vh" }}
        >
            <Grid container spacing={2}>
                <Grid size={6}>
                    <Card sx={{ p: 2, backgroundColor: 'background.default', boxShadow: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h5" fontWeight="bold">
                                    🚀 AgentFlow Engine HUD
                                </Typography>
                                <Chip label={status.toUpperCase()} color={getStatusColor(status)} size="small" />
                                {status === "waiting" && countdown && (
                                    <Chip
                                        label={countdown}
                                        color="warning"
                                        size="small"
                                    />
                                )}
                            </Box>

                            {engineStatus ? (
                                <>
                                    <Typography variant="body1" mb={1}>
                                        <strong>Flow ID:</strong> {current_flow_id}
                                    </Typography>
                                    <Typography variant="body1" mb={1}>
                                        <strong>Step:</strong> {current_step_number} / {total_steps}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" mb={2}>
                                        Step ID: {current_step_id}
                                    </Typography>

                                    <LinearProgress
                                        variant="determinate"
                                        value={progress}
                                        sx={{ height: 8, borderRadius: 5 }}
                                    />
                                </>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No active flow currently running.
                                </Typography>
                            )}

                            <Box mt={3} display="flex" gap={2}>
                                {/* Future: Pause/Resume Buttons */}
                                <Button variant="outlined" size="small" onClick={() => (status === 'paused') ? startQuery.mutate({}) : pauseQuery.mutate({})}>
                                    {status === 'paused' ? 'Resume' : 'Pause'} Engine
                                </Button>
                                <Button variant="outlined" size="small" onClick={() => startQuery.mutate({})}>
                                    Resume Engine
                                </Button>
                                <Button variant="outlined" size="small" onClick={() => {
                                    utilityStore.setModal({
                                        open: true,
                                        sx: {
                                            slots: {
                                                box: {
                                                    borderRadius: "16px"
                                                }
                                            }
                                        },
                                        content: (
                                            <List>
                                                <ListItemButton onClick={() => {
                                                    utilityStore.setModal({ open: false })
                                                    // loadNewFlow(loadDefaultEngineFlow);
                                                    utilityStore.setModal({
                                                        open: true,
                                                        content: <LoadFlowModal flowData={flowData} loadDefaultEngineFlow={(flowId: string) => loadDefaultEngineFlow("on_event_flow_id", flowId)} />
                                                    })
                                                }}>
                                                    On Event Flow
                                                </ListItemButton>
                                                <ListItemButton onClick={() => {
                                                    utilityStore.setModal({ open: false })
                                                    // loadNewFlow(loadDefaultEngineFlow);
                                                    utilityStore.setModal({
                                                        open: true,
                                                        content: <LoadFlowModal flowData={flowData} loadDefaultEngineFlow={(flowId: string) => loadDefaultEngineFlow("fallback_loop_flow_id", flowId)} />
                                                    })
                                                }}>
                                                    Scheduled Flow
                                                </ListItemButton>
                                            </List>
                                        )
                                    })
                                }}>
                                    Load New Flow
                                </Button>
                                <Button variant="outlined" size="small" onClick={() => {
                                    utilityStore.setModal({
                                        open: true,
                                        sx: {
                                            slots: {
                                                box: {
                                                    borderRadius: "16px"
                                                }
                                            }
                                        },
                                        content: (
                                            <>
                                                <Typography variant="h4" gutterBottom>Manage Agents</Typography>
                                                <List>
                                                    <ListItemText 
                                                        primary="No Agents Available"
                                                        secondary="Hint* Create an Agent"
                                                    />
                                                    {Object
                                                        .keys(orchestratorSettings.agents)
                                                        .map((agentName) => ({ name: agentName }))
                                                        .map((agentObject) => (
                                                            <ListItemButton onClick={() => {}}>
                                                                {agentObject.name}
                                                            </ListItemButton>
                                                        ))}
                                                </List>
                                                <Box>
                                                    <Button variant="outlined" size="small" onClick={() => {
                                                        utilityStore.setModal({
                                                            open: true,
                                                            content: (
                                                                <FormContainer
                                                                    schema={{
                                                                        table: "Agents",
                                                                        columns: [
                                                                            { name: "name", dataType: "text" },
                                                                            { name: "description", dataType: "text" },
                                                                            { name: "default_flow", dataType: "text" },
                                                                            { name: "enabled", dataType: "boolean" },
                                                                            { name: "avatarUrl", dataType: "text" },
                                                                            { name: "metadata", dataType: "json" }
                                                                        ]
                                                                    }}
                                                                    // TODO: use real agent structure
                                                                    // {
                                                                    //     "id": "dev-agent",
                                                                    //     "label": "Developer Agent",
                                                                    //     "flowId": "799df894-d12c-447b-8d24-f53b836bf384",
                                                                    //     "role": "developer",
                                                                    //     "enabled": true,
                                                                    //     "avatarUrl": "/avatars/dev-agent.png",
                                                                    //     "description": "Handles feature development and code tasks",
                                                                    //     "metadata": {
                                                                    //       "tier": "core",
                                                                    //       "capabilities": ["frontend", "backend", "bugfix"]
                                                                    //     }
                                                                    //   }
                                                                    handleSubmit={(values) => {
                                                                        const settingsClone = {...orchestratorSettings};
                                                                        try {
                                                                            const newAgent = {
                                                                                ...settingsClone,
                                                                                agents: {...settingsClone.agents, [values.value.name]: values.value.default_flow }
                                                                            };
                                                                            orchestratorSettingsMutation.mutate(newAgent, {
                                                                                onSuccess: () => {
                                                                                    utilityStore.createAlert("success", "Agent created successfully")
                                                                                    // TODO: ANALYTICS + TELEMETRY (track how many agents a user creates)
                                                                                }
                                                                            });
                                                                            
                                                                        } catch (error) {
                                                                            console.warn("Error creating agent:", error);
                                                                        }

                                                                        utilityStore.setModal({ open: false, content: null });
                                                                    }}
                                                                    handleCancelClick={() => utilityStore.setModal({ open: false })}
                                                                />
                                                            )
                                                        })
                                                    }}>
                                                        Create New Agent
                                                    </Button>
                                                </Box>
                                            </>
                                        )
                                    })
                                }}>
                                    Agent Manager
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={6}>
                    <ListItemText primary="Terminal Log" secondary={wsStatus} />
                    <TerminalLogScroller logStream={showLogs} />
                </Grid>
                <Grid size={12}>
                    <Box display="flex" justifyContent="left" mb={2}>
                        <Typography variant="body1" color="text.secondary">
                            AgentFlow Engine <b>onEvent</b> Flow → <DefaultFlowLabel flowId={orchestratorSettings.on_event_flow_id} />
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="left" mb={2}>
                        <Typography variant="body1" color="text.secondary">
                            AgentFlow Engine <b>fallbackLoop</b> Flow → <DefaultFlowLabel flowId={orchestratorSettings.fallback_loop_flow_id} />
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            {/* ✅ DASHBOARD TILE GRID */}
            <Grid container spacing={2} mb={4}>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}><HeartbeatTile /></Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}><AgentsTile /></Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}><TasksTile /></Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}><AutomationsTile /></Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}><LLMUsageTile /></Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}><MemoryTile /></Grid>
            </Grid>
        </motion.div>
    );
}
