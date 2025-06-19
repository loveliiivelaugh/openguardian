import EngineSettingsButton from "./EngineSettingsButton";
import { Box, Button, Stack, Tooltip, Typography } from "@mui/material";
import { motion } from "framer-motion";
import useAgentFlowBuilder from "../useAgentFlowBuilder";
import { useAppStore, useSimulator, useUtilityStore } from "@store/index";
import LoadFlowModal from "@components/Custom/Agents/LoadFlowModal";
import NodeSelectorDrawer from "@components/Custom/Agents/NodeSelectDrawer";
import { ClearFlowButton } from "@components/Custom/Agents/Builder/ClearFlowButton";
import { resolveFlowStructure } from "@components/Custom/Agents/lib/resolveFlowStructure";
import { FlowExecutionDrawer } from "@components/Custom/Agents/FlowExecutionDrawer";
import AgentAnimationSettings from "@components/Custom/Agents/Builder/AgentAnimationSettings";
import { runCurrentFlow } from "@components/Custom/Agents/lib/runCurrentPlan";
import { FlowExecutionResult } from "@components/Custom/Agents/Builder/FlowExecutionResult";
import { startTutorialPopover } from "@components/Custom/Agents/StartTutorial";
import React from "react";


const EditorButtons = ({ setActiveTab }: { setActiveTab: (tab: number) => void }) => {
    const appStore = useAppStore();
    const utilityStore = useUtilityStore();
    const simulatorStore = useSimulator();
    const {
        nodes,
        edges,
        flowData,
        flowsData,
        currentStep,
        flowIdFromUrl,
        onSave,
        onAddAgent,
        updateAgentState,
        handleApproveHitl,
        agentFlowsMutation,
        orchestratorConfig
    } = useAgentFlowBuilder();

    const handleRunFlow = async (flowData?: any, autoTrigger?: boolean) => {
        utilityStore.setDrawer({
            open: true,
            anchor: "right",
            // @ts-ignore
            boxStyle: { width: 560 },
            content: (
                <Box sx={{ p: 2 }}>
                    <FlowExecutionDrawer
                        flow={{
                            ...flowData
                                ? flowData
                                : appStore.hitlNotification,
                            current_step: currentStep,
                            step_id: flowData?.step_id || flowData?.current_step
                        }}
                        onApprove={handleApproveHitl}
                        onClose={() => utilityStore.setDrawer({ open: false })}
                        autoTrigger={autoTrigger}
                    />
                </Box>
            )
        })
    };

    const handleRunFlowClick = async () => {
        // * So whats happening here is that when the canvas is auto populated either from 
        // * a saved flow or a new generated flow, the flow structure is built out when 
        // * it comes through here in activeAgentFlow, but when it is manually created it
        // * only comes through with the nodes and edges defined.
        // * So we need to resolve the flow structure before running the flow.
        let flow: any = resolveFlowStructure(nodes, edges);

        await onSave();

        console.log("RUN Flow:", flow)
        // save flow and get id from url params
        if (!flow?.nodes) {

            // 1. Convert nodes and edges to arrays if they are objects
            const nodesArray = Object.keys(flow).map((nodeId) => ({
                id: nodeId,
                ...nodes[nodeId]
            }))

            flow = {
                // name: "AgentFlow",
                id: flowIdFromUrl,
                description: "Give your flow a description.",
                nodes: nodesArray,
                results: flow.results,
                created_at: new Date().toISOString(),
                current_step: nodesArray[0].id,
                name: flowData.name || "AgentFlow"
            };
        }

        // TODO: Add the following
        // const hasTrigger = flow.nodes.some((node: any) => node.type === 'trigger')
        // if (!hasTrigger) {
        //   utilityStore.setAlert({
        //     open: true,
        //     message: '⚠️ Flow must have a Trigger node.',
        //     severity: 'error',
        //     // duration: 4000
        //   })
        //   return
        // }

        handleRunFlow(flow, true)
    }

    const loadFlow = ({ source, slot, setFlowSlots }: { source?: string, slot?: any, setFlowSlots?: (slots: any) => void }) => {
        // * loadFlow needs to be a global utility at the level of the store so that way ...
        // * ... we can load flows to different places from different places 

        // ...this can be triggered from the canvas to load a flow
        // ...this can be used to load a flow into an assigned slot
        // ...this can be used to load a flow into a slot from the engine view as well
        // TODO: Add source parameter to load flow. Basically we need to know who's calling this
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
            content: <LoadFlowModal flowData={flowsData} loadDefaultEngineFlow={(flowId: string, flow: any) => {
                console.log("Loading flow: ", flowId, flow)
                setFlowSlots && setFlowSlots((prev: any) => ({
                    ...prev,
                    [slot?.id]: {
                        ...slot,
                        icon: slot?.icon === " " ? " 🤖 " : " ",
                        flowId: flowId,
                        metadata: {
                            ...slot?.metadata,
                            flow,
                            flowId: flowId
                        }
                    }
                }))
                utilityStore.setModal({ open: false })
            }}  />
        })
    };

    const addNode = () => {
        utilityStore.setDrawer({
            open: true,
            anchor: "right",
            // @ts-ignore
            boxStyle: { width: 360, m: 4 },
            content: <NodeSelectorDrawer />
        })
    };

    const handleAnimationSettings = () => utilityStore.setDrawer({
        open: true,
        anchor: "right",
        // @ts-ignore
        boxStyle: { width: 360 },
        content: <AgentAnimationSettings updateAgentState={updateAgentState} />
    });

    const handleFlowContext = (completeResult?: any) => utilityStore.setDrawer({
        open: true,
        anchor: "left",
        // @ts-ignore
        boxStyle: { width: 360 },
        content: <>
            {/* {JSON.stringify(simulatorStore.activeAgentFlowData, null, 2)}
            {completeResult && JSON.stringify(completeResult, null, 2)} */}
            {completeResult && (
                <FlowExecutionResult result={completeResult} />
            )}

        </>
    });

    // TODO: Put this on the Orchestrator Config
    console.log("Orchestrator Config: ", orchestratorConfig)
    const [flowSlots, setFlowSlots] = React.useState(orchestratorConfig?.flowSlots || {
        1: { label: "Event", icon: " 🛡️ ", flowId: "", metadata: {} },
        2: { label: "Routing", icon: " 🕓 ", flowId: "", metadata: {} },
        3: { label: "Agent 1", icon: " ", flowId: "", metadata: {} },
        4: { label: "Agent 2", icon: " ", flowId: "", metadata: {} },
        5: { label: "Agent 3", icon: " ", flowId: "", metadata: {} },
        6: { label: "Agent 4", icon: " ", flowId: "", metadata: {} },
        7: { label: "Agent 5", icon: " ", flowId: "", metadata: {} }
    });

    console.log("FlowSlots: ", flowSlots)
    const handleAssignFlow = () => {
        utilityStore.setDrawer({
            open: true,
            anchor: "bottom",
            // @ts-ignore
            boxStyle: { width: 360, m: 4 },
            content: (
                <Box>
                    <Typography variant="h6" color="text.secondary">Agentflow Assignments</Typography>
                    <Stack sx={{ width: "100%", display: "flex", justifyContent: "space-around", margin: "0 auto" }}>
                        <Box display="flex" gap={2}>
                            {Object.keys(flowSlots).map((index) => (
                                <Tooltip title={JSON.stringify(flowSlots[index], null, 2)}>
                                    <Stack key={index} alignItems="center">
                                        <Typography variant="subtitle1" color="text.secondary">
                                            {flowSlots[index]?.label}
                                        </Typography>
                                        <Button key={index} variant="outlined" sx={{ p: 2 }} onClick={() => loadFlow({ 
                                            source: "assign-flow", 
                                            slot: {...flowSlots[index], id: index},
                                            setFlowSlots
                                        })}>
                                            {flowSlots[index]?.icon}
                                        </Button>
                                    </Stack>
                                </Tooltip>
                            ))}
                        </Box>
                    </Stack>
                </Box>
            )
        })
    };

    return (
        <Box mt={2} display="flex" gap={1}>
            <Button variant="contained" onClick={handleFlowContext}>🌳Flow Context</Button>
            <EngineSettingsButton />
            <Button variant="contained" onClick={loadFlow}>♻️ Load Flow</Button>
            <Button variant="contained" onClick={onAddAgent}>🤖Add Agent</Button>
            <Button variant="outlined" onClick={onSave}>💾 Save Flow</Button>
            {startTutorialPopover(1, <Button variant="outlined" onClick={addNode}>+ Add Node</Button>)}
            <Button variant="outlined" onClick={handleAnimationSettings}>
                🎨 Animation Settings
            </Button>
            <Button variant="outlined" onClick={() => handleRunFlowClick()}>
                ⚙️ Open Editor
            </Button>
            <Button variant="outlined" onClick={handleRunFlowClick}>
                ▶️ Run Flow Steps
            </Button>
            <Button variant="outlined" onClick={() => runCurrentFlow({ mutate: agentFlowsMutation.mutate, handleFlowContext })}>
                🛫 Run Full Flow
            </Button>
            <Button variant="outlined" onClick={handleAssignFlow}>
                🚀 Assign Flow
            </Button>
            <ClearFlowButton />
        </Box>
    )
}

export default EditorButtons;
export { EditorButtons };        