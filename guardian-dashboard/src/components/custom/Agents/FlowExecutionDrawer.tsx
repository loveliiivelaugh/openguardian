import React, { useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import { TypingStatus } from "@theme/animations/TextCycle";
import ApproveRejectButtons from "./Builder/ApproveRejectButtons";
import { useUtilityStore } from "@store/index";
import { useFlowStore } from "@store/v2/flowStore";
import confetti from "canvas-confetti";
import { TerminalLogScroller } from "./TerminalLogScroller";
import { useWebSocketStore } from "@hooks/useWebsocket";
import FlowSummaryDrawer from "./Builder/FlowSummaryDrawer";
import { useMutation } from "@tanstack/react-query";
import { queries } from "@api/index";
import { resolveFlowStructure } from "./lib/resolveFlowStructure";
import { useAgentFlowBuilder } from "@components/pages/AgentFlowBuilder/useAgentFlowBuilder";
import { CurrencyBitcoinRounded } from "@mui/icons-material";

const MotionCard = motion(Card);

interface FlowNode {
    id: string;
    data: {
        type: string;
        label?: string;
        name?: string;
        args?: any[];
        results?: any;
        metadata?: {
            description?: string;
            tags?: string[];
            hitlPrompt?: string;
        };
    };
}

interface FlowData {
    id: string;
    name: string;
    description?: string;
    created_at: string;
    current_step: string;
    results: FlowNode[];
}

interface FlowExecutionDrawerProps {}

export const FlowExecutionDrawer: React.FC<FlowExecutionDrawerProps> = () => {
    const runFlowStepsMutation = useMutation(queries.mutate('/api/v1/guardian/agent-flows/run-one'))
    const { logs, lastMessage }: any = useWebSocketStore();
    const [nodeResult, setNodeResult] = React.useState([])
    const utilityStore = useUtilityStore();
    const flowStore = useFlowStore();
    const { onSave, flowIdFromUrl } = useAgentFlowBuilder();

    let { 
        name,
        id,
        description,
        nodes,
        results,
        created_at,
        step_id,
        currentStepId: current_step,
        nextStepId: next_step,
        steps
    }: any = flowStore;
    // Build latest flow structure from the flow store
    const structuredNodes = resolveFlowStructure(flowStore.nodes, flowStore.edges);

    console.log("flowEXECUTION:", flowStore, structuredNodes, flowIdFromUrl)

    const handleApprove = () => {
        // TODO: handleAutoSave() 👈🏼 here
        onSave();
        console.log("STEPID: ", step_id, "NEXTSTEP: ", next_step)
        runFlowStepsMutation.mutate({
            project: name,
            flowId: flowIdFromUrl,
            files: [],
            nodes,
            steps,
            currentNode: structuredNodes.find((n: any) => n.id === current_step),
            prevFlowState: {},
            step_id: current_step,
            next_step: next_step ? next_step : structuredNodes?.[1]?.id,
            results: results,
            metadata: {}
        }, {
            onSuccess: (result) => {
                console.log("✅ Flow Step approved: ", result)
                setNodeResult([...nodeResult, result])
                utilityStore.createAlert("success", "Flow approved successfully");
                // TODO: this logic should go in the backend
                // TODO: Add last step logic close drawer open completion drawer
                if (!result.next_step) {
                    // Close drawer
                    utilityStore.setDrawer({ open: false, content: null });
                    // Open completion drawer
                    confetti();
                    utilityStore.createAlert("success", "Flow completed successfully");
                    setTimeout(() => {
                        utilityStore.setDrawer({ open: true, content: <FlowSummaryDrawer flow={{
                            // TODO: Update these properties
                            name: name,
                            id: id,
                            description: description,
                            nodes: nodes,
                            results: results,
                            created_at: created_at,
                            currentStepId: current_step,
                            nextStepId: next_step,
                            steps: steps
                        }} /> });
                    }, 250);
                    return;
                }
                const thisStepIndex = nodes.findIndex((n: any) => n.id === result.next_step);
                const followingStepId = nodes[thisStepIndex + 1]?.id;
                flowStore.setCurrentStep(result.next_step);
                flowStore.setNextStep(followingStepId);
                flowStore.updateNodeData(result.next_step, {
                    ...nodes[thisStepIndex],
                    result: {
                        ...nodes[thisStepIndex]?.result,
                        status: 'completed'
                    }
                });
                flowStore.setCurrentContext([
                    ...flowStore.currentContext,
                    {...result.context, id: result.next_step}
                ]);
            },
            onError: () => {
                utilityStore.createAlert("error", "Failed to approve flow");
            }
        })
    }

    const handleReject = () => {
        // TODO: Needs to handle cancelling live/active request
        // TODO: if no request active, then should go back a step
    }

    // todo: get rid of the following formatting helpers
    // todo: ... everything should come from global hooks and stores
    const normalizeNodes = (nodes: any) => Object
        .keys(nodes)
        .map((id) => ({
            id,
            name: id,
            ...nodes[id],
        }));
    
    if (!current_step && nodes.length) current_step = nodes?.[0]?.id;
    if (!results) results = nodes;
    if (!Array.isArray(nodes)) nodes = normalizeNodes(nodes);

    // Auto-scroll to current step
    useEffect(() => {
        const el = document.getElementById(`flow-step-${flowStore.currentStepId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [flowStore.currentStepId]);

    return (
        <Box p={3} display="flex" flexDirection="column" height="100%">
            <Box mb={2}>
                <Typography variant="h6" fontWeight="bold">
                    {flowIdFromUrl}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                    Flow: {name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Started {created_at && new Date(created_at).toLocaleString()}
                    {/* {formatDistanceToNow(new Date(created_at), { addSuffix: true })} */}
                </Typography>
                <Chip label={`Step ${current_step}`} size="small" sx={{ mt: 1 }} />
            </Box>

            <Box flexGrow={1} pr={1} sx={{ overflowY: "auto" }}>
                {nodes?.map((node: any, index: number) => {
                    const isCurrent = (node.id === flowStore.currentStepId)
                    if (!node?.data) return <></>
                    return (
                        <>
                            <motion.div
                                key={node.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <MotionCard
                                    {...(isCurrent && { id: `flow-step-${flowStore.currentStepId}` })}
                                    variant="outlined"
                                    sx={{
                                        mb: 2,
                                        position: "relative",
                                        borderColor: isCurrent ? "primary.main" : "divider",
                                        boxShadow: isCurrent ? 4 : 1,
                                    }}
                                    whileHover={{ scale: isCurrent ? 1.05 : 1 }}
                                >
                                    {isCurrent && (
                                        <motion.div
                                            animate={{
                                                boxShadow: [
                                                    '0 0 0px rgba(25, 118, 210, 0)',
                                                    '0 0 6px rgba(25, 118, 210, 0.5)',
                                                    '0 0 12px rgba(25, 118, 210, 0.75)',
                                                    '0 0 6px rgba(25, 118, 210, 0.5)',
                                                    '0 0 0px rgba(25, 118, 210, 0)'
                                                ]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: 'easeInOut'
                                            }}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                borderRadius: 8,
                                                zIndex: 1,
                                                pointerEvents: 'none'
                                            }}
                                        />
                                    )}
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                   
                                        <CardHeader
                                            title={`${index + 1}. ${node.data.label || node.data.name || node.data.data?.label || node.data.data?.name}`}
                                            subheader={<Chip label={node.data?.data?.type || node?.data?.type} />}
                                        />
                                        <CardHeader 
                                            title={<Typography variant="subtitle1" fontSize={14}>Completed in 12s ⏱️</Typography>}
                                            subheader={<Chip 
                                                color={results?.[index]?.status || "info"}
                                                // @ts-ignore
                                                label={{
                                                    "success": "✅ Success",
                                                    "error": "❌ Error",
                                                    "warning": "⚠️ Warning",
                                                    "info": "ℹ️ Info"
                                                }[(results?.[index]?.status || "info") as any]} 
                                                />
                                            }
                                        />
                                    </Box>
                                    <CardContent>
                                        {node.data.metadata?.description && (
                                            <Typography variant="body2" color="text.secondary" mb={1}>
                                                {node.data.metadata.description}
                                            </Typography>
                                        )}

                                        {node?.data?.results || (nodeResult.length > 0) 
                                            && nodeResult.some(({ plan } : { plan: string }) => plan.steps[0].id === node.id) 
                                            && (
                                            <Box
                                                component="pre"
                                                sx={{
                                                    backgroundColor: "background.paper",
                                                    border: "1px solid",
                                                    borderColor:     "divider",
                                                    borderRadius: 1,
                                                    p: 2,
                                                    whiteSpace: "pre-wrap",
                                                    fontSize: 14,
                                                    position: "relative",
                                                    zIndex: 1,
                                                }}
                                            >
                                                {(nodeResult.length > 0) && nodeResult
                                                    .filter(({ plan } : { plan: string }) => plan.steps[0].id === node.id)
                                                    .map((completedNode) => (
                                                        <>
                                                            {node?.data?.results && (typeof node.data.results === "string")
                                                                ? node.data.results
                                                                : JSON.stringify(node.data.results, null, 2)
                                                            }
                                                            {/* <TerminalLogScroller logStream={[
                                                                JSON.stringify(completedNode.output.log, null, 2),
                                                                ...completedNode.output.logs
                                                                ]}
                                                            /> */}
                                                            {[
                                                                JSON.stringify(completedNode.output.log, null, 2),
                                                                ...completedNode.output.logs
                                                            ]}

                                                        </>
                                                    ))}
                                            </Box>
                                        )}
                                        {isCurrent
                                            ? (
                                                <Box>
                                                    <Box>
                                                        <TypingStatus phrases={[
                                                                "Awaiting result...",
                                                                "Automation Engines running",
                                                                "Nudging LLMs"
                                                            ]}
                                                        />
                                                    </Box>
                                                    <Box>
                                                        <TerminalLogScroller logStream={[lastMessage?.log || ""]} />
                                                    </Box>
                                                    <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", px: 2, pt: 2 }}>
                                                        <ApproveRejectButtons
                                                            approveIsLoading={runFlowStepsMutation.isPending}
                                                            onApprove={handleApprove}
                                                            onReject={handleReject}
                                                            waiting={runFlowStepsMutation.isPending}
                                                        />
                                                    </Box>
                                                </Box>
                                            ) : null
                                        }
                                    </CardContent>
                                </MotionCard>
                            </motion.div>
                            {/* {isCurrent && (
                                <motion.div
                                    initial={{ opacity: 0, x: 0 }}
                                    animate={{ opacity: 1, x: [0, 10, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    style={{ textAlign: 'center', marginTop: 4, color: '#1976d2' }}
                                >
                                    ↓
                                </motion.div>
                            )} */}
                            {isCurrent
                            // TODO: move animated arrow to its own file
                                    ? (
                                        <>
                                <motion.div
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 4 }}
                                    transition={{ duration: 0.5 }}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        margin: '8px 0'
                                    }}
                                    >
                                    <Box
                                        sx={{
                                        width: 4,
                                        height: 40,
                                        borderRadius: 2,
                                        background: "linear-gradient(to bottom, #9f6aff, #ff80bf)",
                                        boxShadow: "0 0 6px 2px rgba(159, 106, 255, 0.4)",
                                        animation: "pulseArrow 1.5s infinite ease-in-out"
                                        }}
                                    />
                                    <style>{`
                                        @keyframes pulseArrow {
                                        0% { transform: scaleY(1); opacity: 0.5; }
                                        50% { transform: scaleY(1.4); opacity: 1; }
                                        100% { transform: scaleY(1); opacity: 0.5; }
                                        }
                                    `}</style>
                                </motion.div>
                                {/* Fix this. Key on something to complete the flow */}
                                {(index === parseInt(current_step)) && (
                                    <Alert severity="success">
                                        Flow completed!
                                    </Alert>
                                )}
                                </>
                            ) : null}
                        </>
                    )
                }
                )}
            </Box>
        </Box>
    );
};
