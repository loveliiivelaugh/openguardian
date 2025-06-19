// ? Improve SOC by separating logic and layout ...
// ? ... also making logic modularly accessible to other components
import { useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAppStore, useChatStore, useUtilityStore } from '@store/index';
import { useFlowStore } from '@store/v2/flowStore';
import { useWebSocketStore } from '@hooks/useWebsocket'; //TODO: Update this to be in a Zustand store
import { resolveFlowStructure } from '@components/Custom/Agents/lib/resolveFlowStructure';
import { queries } from '@api/index';
import { convertAgentFlowToCanvasNodes, getEdgesFromAgentFlow } from '@components/Custom/Agents/lib/convertAgentFlowToCanvasNodes';
import { loadSubFlowForNode } from '@components/Custom/Agents/lib/loadSubFlowForNode';
import { generateEdgesFromSequentialNodes } from '@components/Custom/Agents/lib/generateEdgesFromSequentialNodes';

const useAgentFlowBuilder = () => {
    // * Hooks
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    // * Queries
    const flowsQuery = useQuery(queries.query(`/database/read_db/agent_flows`));
    const flowQuery = useQuery(queries.query(`/api/v1/guardian/agent-flows`));
    const engineQuery = useQuery(queries.query(`/database/read_db/orchestrator_settings`));
    // * Mutations
    const databaseMutation = useMutation(queries.mutate("/database/write?table=agent_flows"));
    const agentFlowsMutation = useMutation(queries.mutate("/api/v1/guardian/agent-flows/run"));
    const agentFlowChatMutation = useMutation(queries.mutate("/api/v1/guardian/agent-flows/chat"));
    const codegenMutation = useMutation(queries.mutate("/api/v1/guardian/agent-flows/run-one"));
    // * Stores
    const appStore = useAppStore();
    const chatStore = useChatStore()
    const utilityStore = useUtilityStore();
    // * Flow Store
    const {
        flowName,
        currentStep,
        steps,
        nodes,
        edges,
        setNodes,
        setEdges,
        addNode,
        addEdge,
        selectedNode,
        selectedEdge,
        setSelectedNode,
        setSelectedEdge,
        updateNodeData
    }: any = useFlowStore();
    // * Orchestrator Config/Flow ID/Flow Data/Connect/Edge Click
    const onConnect = useCallback((params: any) => addEdge({ ...params, animated: true }), [addEdge]);
    const onEdgeClick = (event: any, edge: any) => setSelectedEdge(edge);
    const orchestratorConfig = engineQuery?.data?.data?.[0] || {};
    const flowIdFromUrl = new URLSearchParams(location.search).get("flowId");
    const flowData = flowQuery?.data?.data || [];
    const flowsData = flowsQuery?.data?.data || [];
    const structuredNodes = resolveFlowStructure(nodes, edges);
    const selected = nodes.find((n: Node & { id: string }) => n.id === selectedNode);
    const savePayload = {
        // TODO: Update this to use single source of truth
        name: flowName || "",
        description: "",
        // name: activeAgentFlow?.name || "Unnamed Flow",
        // description: activeAgentFlow?.description || "Flow description",
        nodes: structuredNodes,
        edges,
        created_by: "1"//TODO: Update to actual (Prep for multi-user/tenant)
    };
    // * Effects
    useMemo(() => {
        if (!flowIdFromUrl || !flowsData?.length) return;

        const selectedFlow = flowsData.find((f: any) => f.id === flowIdFromUrl);
        if (!selectedFlow) return;

        const normalizedNodes = Array.isArray(selectedFlow.nodes)
            ? selectedFlow.nodes
            : Object.keys(selectedFlow.nodes).map((id) => ({
                id,
                name: id,
                ...selectedFlow.nodes[id],
            }));

        // Check for nodes with default_flow_id and load subflows
        normalizedNodes.forEach((node: any) => {
            const id = node.id;
            const defaultFlowId = node.data?.config?.default_flow_id;
            if (defaultFlowId) {
                loadSubFlowForNode(id, defaultFlowId);
            }
        });

        const normalizedEdges = Array.isArray(selectedFlow.edges)
            ? selectedFlow.edges
            : Object.keys(selectedFlow.edges).map((id) => ({
                id,
                source: selectedFlow.edges[id].source || id,
                target: selectedFlow.edges[id].target || id,
                ...selectedFlow.edges[id],
            }));

        console.log("🌱 Loading AgentFlow from URL:", selectedFlow);

        const allEdges: any = [...normalizedEdges, ...generateEdgesFromSequentialNodes(normalizedNodes)];

        useFlowStore.getState().setNodes(normalizedNodes);
        useFlowStore.getState().setEdges(allEdges);
        useFlowStore.getState().setCurrentStep(selectedFlow.current_step || nodes?.[0]?.id || "");
        useFlowStore.getState().setNextStep(selectedFlow.next_step || nodes?.[1]?.id || "");
        if (selectedFlow.current_step) {
            useFlowStore.getState().setCurrentContext({
                [selectedFlow.current_step || nodes[0].id]: {}//TODO: key on the nodes results
            });
        }

        // setActiveAgentFlow(selectedFlow);//TODO: Remove this and rewrite -- using single source of truth
    }, [flowIdFromUrl, flowsData]);

    // TODO: Fix the useEffects
    useEffect(() => {
        // if (appStore.hitlNotification) handleRunFlow(appStore.hitlNotification)
    }, [appStore.hitlNotification])

    // useEffect(() => {
    //   if (currentNode?.id) {
    //     setSelectedElements([{ id: currentNode.id, type: 'node' }])
    //   }
    // }, [currentNode])

    useEffect(() => {
        const unsub = useFlowStore.subscribe(
            (state: any) => ({ nodes: state.nodes, edges: state.edges }),
            // databaseMutation.mutate({
            //   where: {
            //     id: flow.id
            //   },
            //   data: {
            //     nodes: flow.nodes,
            //     edges: flow.edges
            //   }
            // })
            // debounce(async (flow: any) => {
            // })
        )
        return unsub
    }, [])

    // * Helpers
    const updateUrlWithFlowId = (flowId: string) => {
        const params = new URLSearchParams(location.search);
        params.set('flowId', flowId);

        navigate({ search: params.toString() }, { replace: true });
    };

    const handleUpdateFlowName = (e: React.ChangeEvent<HTMLInputElement>) => {
        // use the flowStore to track the flow's metadata
        const { setFlowMetadata } = useFlowStore.getState();

        // if the flow has not been saved, alert the user
        if (!flowIdFromUrl) utilityStore.createAlert("error", "Failed to update flow name");

        // req'd flowIdFromUrl, update the flow's name in the flowStore
        setFlowMetadata(flowIdFromUrl, e.target.value);
    };

    const handleApproveHitl = (currentAgentFlow?: any) => {
        console.log("🚀 currentAgentFlow:", currentAgentFlow);
        const flowStore = useFlowStore.getState();

        // Build latest flow structure from the flow store
        const structuredNodes = resolveFlowStructure(flowStore.nodes, flowStore.edges);
        
        const currentStepFR = currentStep ? currentStep : structuredNodes[0].id;
        const currentNode = structuredNodes.find((n: any) => n.id === currentStepFR);
        const finalFlow = {
            ...(currentAgentFlow || appStore.hitlNotification),
            nodes: structuredNodes,
            edges: flowStore.edges,
            current_step: currentStepFR,
            currentNode: currentNode
        };
        console.log("🚀 FINAL SUBMIT flow:", finalFlow, currentNode, structuredNodes, currentStepFR);


        codegenMutation.mutate({
            project: finalFlow?.name || '',
            flowId: finalFlow?.id || '',
            files: [],
            nodes,
            steps,
            currentNode: currentNode,
            next_step: finalFlow.nodes.find(({ id }: { id: string }) => (id === finalFlow.current_step))?.next?.[0] || '',
            prevFlowState: finalFlow,
            step_id: currentStepFR,
            metadata: {}
        }, {
            onSuccess: (data) => {
                console.log("✅ Codegen approved:", data);
                const { next_step, output } = data;
                useFlowStore.getState().setCurrentStep(next_step);
                // Right here, we need to update the flow in the database
                // Whenever the flow is being manually run through the UI the next step
                // ... can be triggered with the response from the last step
                // ...only when automated should the next step come from the real time ...
                // ... event subscription

                // Get current flow state from wherever you're storing it
                const currentFlow = useFlowStore.getState();

                // Find and update the node in the local flow state
                const updatedNodes = currentFlow.nodes.map((node: any) => {
                    if (node.id === next_step) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                result: output, // or step_result if your backend uses a different name
                            }
                        };
                    }
                    return node;
                });

                // Set updated state into store
                useFlowStore.setState({
                    nodes: updatedNodes,
                    currentStep: next_step,
                });
                useFlowStore.getState().setCurrentStep(next_step);
                // TODO: Update to use single source of truth
                // // Optionally update flow object or display state
                // setActiveAgentFlow((prev: any) => ({
                //     ...prev,
                //     results: [
                //         ...(prev?.results || []),
                //         {
                //             id: current_step,
                //             type: 'function',
                //             result: output,
                //             status: 'success'
                //         }
                //     ],
                //     current_step
                // }));

                // ✅ UX polish
                utilityStore.createAlert('success', 'Codegen approved!');
                appStore.setHitlNotification(null);
            },
            onError: (err) => {
                utilityStore.createAlert('error', 'Failed to approve codegen');
                console.error(err);
            }
        });
    };

    const updateAgentState = () => { }//TODO: implement

    const onAddAgent = () => {
        addNode({
            id: crypto.randomUUID(),
            type: 'agent',
            position: {
                x: Math.random() * 600,
                y: Math.random() * 400,
            },
            data: {
                label: 'Agent',
                type: 'agent',
                run: 'runAgent',
                args: {},
                config: {
                    default_flow_id: '',
                    assigned_flow_ids: [],
                    cooldown_seconds: 30,
                    behavior: 'default',
                    context_mode: 'standard',
                    created_by: 'guardian'
                }
            }
        });
    };

    const onSave = () => {
        const { flowName, nodes, edges, currentStepId } = useFlowStore.getState();

        const savePayload = {
            name: flowName,
            nodes,
            edges,
            current_step: currentStepId,
            // updated_at: new Date(), // optional if you want timestamp tracking
        };

        if (flowIdFromUrl) {
            // UPDATE
            databaseMutation.mutate({
                ...savePayload,
                id: flowIdFromUrl
            }, {
                onSuccess: ({ data }) => {
                    console.log("✅ Flow updated:", data);
                    utilityStore.createAlert("success", "Flow updated!");
                },
                onError: (err) => {
                    utilityStore.createAlert("error", "Failed to update flow");
                    console.error(err);
                }
            });
        } else {
            // INSERT
            databaseMutation.mutate(savePayload, {
                onSuccess: ({ data }) => {
                    console.log("🆕 Flow created:", data);
                    updateUrlWithFlowId(data.id);
                    utilityStore.createAlert("success", "Flow saved!");
                },
                onError: (err) => {
                    utilityStore.createAlert("error", "Failed to save flow");
                    console.error(err);
                }
            });
        }
    };

    const handleChatSubmit = () => {
        agentFlowChatMutation.mutate({
            prompt: chatStore.inputMessage
        }, {
            onSuccess: (data) => {

                chatStore.handleInput("")
                utilityStore.createAlert('success', 'Message sent!')

                // * Dynamically build and set the nodes and edges visually in the canvas
                try {
                    const formattedNodes = convertAgentFlowToCanvasNodes(data.agentFlowData.nodes)
                    const formattedEdges = getEdgesFromAgentFlow(data.agentFlowData.nodes)
                    useFlowStore.setState({ nodes: [...formattedNodes], edges: [...formattedEdges] })
                } catch (error) {
                    console.error(error)
                    utilityStore.createAlert('error', 'Failed to load flow in canvas')
                }

                // * From here start the flow "Run Flow"
                const expectedShape = {
                    flowData: {
                        data: {
                            ...data.agentFlowData,
                            // Results are just the blank flowData because no nodes have been executed yet
                            results: Object.keys(data.agentFlowData?.nodes).map((nodeId) => ({
                                id: nodeId,
                                ...data.agentFlowData?.nodes[nodeId],
                                data: {
                                    ...data.agentFlowData?.nodes[nodeId],
                                    edges: edges
                                }
                            })) || []
                        }
                    }
                }

                // TODO: SINGLE SOURCE OF TRUTH
                // setActiveAgentFlow(expectedShape);

                // // * Run the flow
                // handleRunFlow(expectedShape);
            },
            onError: (error) => {
                utilityStore.createAlert('error', 'Failed to send message')
            }
        })
    };

    return {
        flowIdFromUrl,
        flowData,
        flowsData,
        flowName,
        structuredNodes,
        savePayload,
        orchestratorConfig,
        nodes,
        edges,
        setNodes,
        setEdges,
        addNode,
        addEdge,
        selectedNode,
        selectedEdge,
        setSelectedNode,
        setSelectedEdge,
        updateNodeData,
        currentStep,
        onSave,
        onConnect,
        onAddAgent,
        onEdgeClick,
        updateAgentState,
        handleApproveHitl,
        updateUrlWithFlowId,
        handleUpdateFlowName,
        handleChatSubmit,
        agentFlowChatMutation,
        agentFlowsMutation
    }
}

export default useAgentFlowBuilder;
export { useAgentFlowBuilder };