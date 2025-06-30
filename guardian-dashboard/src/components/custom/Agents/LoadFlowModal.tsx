import Fuse from "fuse.js";
import { useState, useMemo } from "react";
import { Box, Typography, TextField, Grid, Chip, Checkbox } from "@mui/material";
import { LoadFlowModalContent } from "./LoadFlowModalContent";
import { useUtilityStore } from "@store/index";
import { useFlowStore } from "@store/v2/flowStore";
import { autoLayoutNodesWithEdges } from "@helpers/autoLayoutNodes";
import { generateEdgesFromSequentialNodes } from "./lib/generateEdgesFromSequentialNodes";
import { useMutation } from "@tanstack/react-query";
import { queries } from "@api/index";
import { useSetFlowId } from "@hooks/useFlowParams";

const LoadFlowModal = (
    { flowData, loadDefaultEngineFlow }: 
    { flowData: any, loadDefaultEngineFlow?: (flowId: string) => void }
) => {
    const setFlowId = useSetFlowId();
    const flowMutation = useMutation(queries.mutate(`/api/v1/guardian/agent-flows`));
    const functionMutation = useMutation(queries.mutate('/api/v1/guardian/function-registry'));
    const { setSubflowLoading, setSelectedNode, setCurrentStep } = useFlowStore();
    const utilityStore = useUtilityStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredFlows, setFilteredFlows] = useState(flowData);
    const fuse = useMemo(() => {
        return new Fuse(flowData, {
            keys: ["name", "description", "tags"],
            threshold: 0.3,
        });
    }, [flowData]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (!term) {
            setFilteredFlows(flowData);
        } else {
            const results = fuse.search(term);
            setFilteredFlows(results.map((res) => res.item));
        }
    };

    return (
        <Box p={1}>
            <Typography variant="h5" gutterBottom>
                Load an Automation Flow
            </Typography>
            <TextField
                fullWidth
                label="Search"
                placeholder="Search flows..."
                value={searchTerm}
                onChange={handleSearch}
                sx={{ mb: 2, color: "#fff" }}
            />
            {/* <TextField fullWidth label="Search" placeholder="Search flows..." sx={{ mb: 2 }} /> */}
            <Grid container spacing={2} sx={{ maxHeight: 600, overflowY: 'auto' }}>
                {filteredFlows.map((flow: any, idx: number) => (
                    <Grid size={12} key={idx}>
                        {console.log("LETMESEE THE NODE: ", flow) as any}
                        {/* distinguish between plan and agent flow */}
                        {flow?.metadata?.source === 'plan' ? <Chip label="Plan Flow" /> : null}

                        <LoadFlowModalContent
                            {...flow}
                            onLoad={async (flow: any) => {
                                if (!flow) return;

                                // Set flowId in URL query params
                                setFlowId(flow.id);

                                // Enrich the flow to make sure the flow data object is mature
                                const data = await flowMutation.mutate({ id: flow.id, flowId: flow.id, flow });

                                console.log("LETMESEE THE FLOW: ", { enrichedFlow: data }, flow, loadDefaultEngineFlow)
                                if (loadDefaultEngineFlow) {
                                    loadDefaultEngineFlow(flow.id, flow);
                                }

                                let nodes = flow?.nodes || [];
                                let edges = flow?.edges || [];

                                const getNodePosition = (i: number, type = 'default') => {
                                    const rowHeight = 180;
                                    const colWidth = 250;
                                    return {
                                        x: (i % 4) * colWidth,
                                        y: Math.floor(i / 4) * rowHeight + (type === 'trigger' ? -50 : 0),
                                    };
                                };

                                // Normalize nodes (convert from object to array if needed)
                                if (!Array.isArray(nodes)) {
                                    nodes = Object.entries(nodes).map(([id, data]: any, index: number) => ({
                                        id,
                                        ...data,
                                        position: data?.position || getNodePosition(index, data?.type),
                                        type: data?.type || 'agent',
                                        data: {
                                            ...data?.data,
                                            label: data?.data?.label || data?.run || data?.id,
                                            type: data?.type,
                                            run: data?.run,
                                            args: data?.args || {},
                                            config: data?.config || {},
                                        },
                                    }));
                                }

                                nodes = await Promise.all(
                                    nodes.map(async (node: any, index: number) => {
                                        const fallbackRun = node.data?.run || node.run;
                                        // functionRegistry[fallbackRun];// 👈🏼 Lets turn this into a nice backend request that matches the function and returns everything it needs all nicely both fn name and args schema
                                        const funcMeta = await functionMutation.mutate({ functionName: fallbackRun })
    
                                        // Warn if function is missing
                                        if (!funcMeta) {
                                            console.warn(`⚠️ Missing function in registry: "${fallbackRun}" for node "${node.id}"`);
                                        }
    
                                        return ({
                                            ...node,
                                            position: node?.position || getNodePosition(index, node?.type),
                                            type: node?.type || 'agent',
                                            data: {
                                                ...node.data,
                                                label: node.data?.label || fallbackRun || node?.data?.run || node.id,
                                                type: node.data?.type,
                                                run: fallbackRun || node.data?.run,
                                                args_schema: funcMeta?.args_schema || {}, // ← 🔥 preload args_schema
                                                args: node.data?.args || {},
                                                config: node.data?.config || {},
                                            },
                                        });
                                    })
                                );

                                // Normalize edges
                                if (!Array.isArray(edges) && edges) {
                                    edges = Object.entries(edges).map(([id, data]: any) => ({
                                        id,
                                        ...data,
                                    }));
                                }

                                // Auto layout
                                const { nodes: laidOutNodes, edges: autoEdges }: any = autoLayoutNodesWithEdges(nodes);
                                const allEdges: any = [...autoEdges, ...generateEdgesFromSequentialNodes(laidOutNodes)];
                                // Load into store
                                const { setNodes, setEdges } = useFlowStore.getState();
                                setNodes(laidOutNodes);
                                setEdges(allEdges);

                                setSelectedNode(laidOutNodes[0]);
                                setCurrentStep(laidOutNodes[0].id);

                                // 2. Find all nodes that need subflows
                                const subflowPromises: Promise<void>[] = [];

                                // Load subflows for any nodes that have default_flow_id
                                laidOutNodes.forEach((node: any) => {
                                    const flowId = node?.data?.config?.default_flow_id;
                                    if (flowId) {
                                        const { loadSubflow } = useFlowStore.getState();
                                        loadSubflow(node.id, flowId);
                                    }
                                });

                                // 3. Parallel wait for all subflows to load
                                if (subflowPromises.length > 0) {
                                    setSubflowLoading(true);

                                    Promise.all(subflowPromises)
                                        .then(() => {
                                            console.log('✅ All subflows loaded.');
                                        })
                                        .catch((err) => {
                                            console.error('❌ Error loading subflows:', err);
                                        })
                                        .finally(() => {
                                            setSubflowLoading(false); // 💥 turn off loading overlay
                                        });
                                } else {
                                    setSubflowLoading(false); // no subflows to load
                                }

                                // Close modal if any
                                utilityStore.setModal({ open: false });
                            }}
                        // onLoad={() => {

                        //     // 1. Set nodes and edges from available data
                        //     let nodes = flow?.nodes?.steps || flow?.nodes || [];
                        //     let edges = flow?.edges || [];

                        //     console.log("LETMESEE THE FLOWS and EDGES: ", nodes, edges)

                        //     // // 2. Convert nodes and edges to arrays if they are objects
                        //     // if (!Array.isArray(nodes)) {
                        //     //   nodes = Object.keys(nodes).map((nodeId) => ({
                        //     //     id: nodeId,
                        //     //     ...nodes[nodeId]
                        //     //   }))
                        //     // }
                        //     // if (!Array.isArray(edges) && edges) {
                        //     //   edges = Object.keys(edges).map((edgeId) => ({
                        //     //     id: edgeId,
                        //     //     ...edges[edgeId]
                        //     //   }))
                        //     // }

                        //     const getNodePosition = (i: number, type = 'default') => {
                        //         const rowHeight = 180;
                        //         const colWidth = 250;
                        //         return {
                        //             x: (i % 4) * colWidth,
                        //             y: Math.floor(i / 4) * rowHeight + (type === 'trigger' ? -50 : 0),
                        //         };
                        //     };

                        //     // 2. Convert nodes and edges to arrays if they are objects
                        //     if (!Array.isArray(nodes)) {
                        //         nodes = Object.entries(nodes).map(([id, data]: any, index: number) => ({
                        //             id,
                        //             ...data,
                        //             // position: data?.position || { x: 0, y: 0 }, // 💡 add fallback
                        //             position: data?.position || getNodePosition(index, data?.type),
                        //             type: data?.type || 'agent',
                        //             // type: data?.run?.startsWith("run-") ? "function" : "default",
                        //             // data: data?.data || {},
                        //             data: { ...data?.data, label: data?.data?.label || data?.run || data?.id },
                        //             next: (index < (nodes.length - 1)) ? [nodes[index + 1]?.id] : []
                        //         }))
                        //     }

                        //     nodes = nodes.map((node: any, index: number) => ({
                        //         ...node,
                        //         // position: node?.position || { x: 0, y: 0 }, // 💡 add fallback
                        //         position: node?.position || getNodePosition(index, node?.type),
                        //         type: node?.type || 'agent',
                        //         // type: node.run?.startsWith("run-") ? "function" : "default",
                        //         // data: node?.data || {},
                        //         data: { ...node.data, label: node.data?.label || node.run || node.id },
                        //         next: (index < (nodes.length - 1)) ? [nodes[index + 1]?.id] : []
                        //     }));

                        //     if (!Array.isArray(edges) && edges) {
                        //         edges = Object.entries(edges).map(([id, data]: any) => ({
                        //             id,
                        //             ...data
                        //         }))
                        //     }

                        //     const { nodes: laidOutNodes, edges: autoEdges }: any = autoLayoutNodesWithEdges(nodes);

                        //     // 3. Set nodes and edges in flow store
                        //     useFlowStore.setState({
                        //         nodes: [...laidOutNodes],
                        //         edges: [...autoEdges]
                        //     })

                        //     // 4. Close modal
                        //     utilityStore.setModal({ open: false })
                        // }}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default LoadFlowModal;
