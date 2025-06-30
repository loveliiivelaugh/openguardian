// components/AgentFlow/NodeConfigDrawer.tsx
import { Box, Button, Typography } from "@mui/material"
import { useUtilityStore } from "@store/index"
import { useFlowStore } from "@store/v2/flowStore"
import FormContainer from "@components/Custom/forms/FormContainer"
import { useQuery } from "@tanstack/react-query"
import { queries } from "@api/index"
import { formatNodeConfigs } from "./lib/formatNodeConfigs"
import { AgentOverlay } from "./Builder/AgentsOverlay"
import { Close, Delete } from "@mui/icons-material"
import { useAgentFlowBuilder } from "@components/pages/AgentFlowBuilder/useAgentFlowBuilder"
import { loadSubFlowForNode } from "./lib/loadSubFlowForNode"

interface NodeConfigDrawerProps  { node: Node, onSave: (flow: any) => void, flow: any };

export default function NodeConfigDrawer({ node, onSave, flow }: NodeConfigDrawerProps) {
  const utilityStore = useUtilityStore();
  const { flowData } = useAgentFlowBuilder();
  let selectedNode = useFlowStore((s: any) => s.selectedNode)
  const updateNodeData = useFlowStore((s: any) => s.updateNodeData)
  const functionsQuery = useQuery(queries.query("/database/read_db/function_registry"))
  const availableAgentsQuery = useQuery(queries.query("/database/read_db/agents"))
  const nodeSchemaConfigsQuery = useQuery(queries.query("/database/read_db/node_configs"))

  const nodeSchemasData = nodeSchemaConfigsQuery.data?.data || []
  const availableFunctions = functionsQuery.data?.data.map(({name}: {name: string}) => name) || []
  const availableAgents = availableAgentsQuery.data?.data.map(({role}: {role: string}) => role) || []

  console.log({ availableFunctions, availableAgents})

  const nodeSchemas: Record<string, any> = nodeSchemasData
    ? formatNodeConfigs(nodeSchemasData, { availableFunctions, availableAgents })
    : {}

  console.log("🔌 Node Schemas from DB: ", nodeSchemas, node, flow)
  if (!selectedNode) selectedNode = node

  if (!selectedNode) return <Box p={2}><Typography>No node selected</Typography></Box>

  const nodeType = selectedNode?.type || selectedNode?.data?.type || "agent"
  const schema = nodeSchemas[nodeType] || { table: "generic", columns: [] }

  const deleteNode = () => {
    const { nodes, edges, selectedNode, selectedEdge } = useFlowStore.getState()
    if (!selectedNode || !selectedEdge) return
    const selectedNodes = nodes.filter((node) => selectedNode.includes(node.id))
    const selectedEdges = edges.filter((edge) => selectedEdge.includes(edge.id))

    useFlowStore.setState({
      nodes: nodes.filter((n) => !selectedNode.includes(n.id)),
      edges: edges.filter((e) => !selectedEdge.includes(e.id))
    })
  }

  console.log("🔌 Schema SELECTEDNODE: ", schema, selectedNode, node, flowData)

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Configure: {nodeType}
      </Typography>
      <FormContainer
        schema={schema}
        mapDefaultValue={(column) => {
          console.log("MAPDEFAULTS IN NODECONFIG: ", column, node, flow)
          // TODO: Finish default value exchange
          return column?.defaultValue 
          || ({
            function: "",
            params: {},
            created_by: flow?.created_by
          }[column?.name])  
          || ""
        }}
        handleSubmit={async (values: any) => {
          console.log("🚀 handleSubmit values:", values, selectedNode, flowData)
          useFlowStore.getState().updateNodeData(selectedNode.id, {
            ...selectedNode.data,
            config: {
              ...selectedNode.data.config,
              ...values.value, // ✅ merge updated config fields (like default_flow_id)
              args: values.value.params,
              // TODO: fix this -- This is hacky and names are not unique
              default_flow_id: flowData.find(({ name }: { name: string }) => name === values.value.default_flow_id)?.id
            },
            type: "function", //TODO: make this dynamic
            name: values.value.function,
            label: values.value.function,
            args: values.value.params
          })

          // ✅ 🧠 Trigger subflow load if default_flow_id is present
          const flowId = values.config?.default_flow_id;
          if (flowId) {
            await loadSubFlowForNode(selectedNode.id, flowId);
          }

          onSave({})
          utilityStore.createAlert('success', 'Node configured!');
          utilityStore.setDrawer({ open: false, content: null });
        }}
        handleCancelClick={() => utilityStore.setDrawer({ open: false, content: null })}
      />
      <Box sx={{ textAlign: "right" }}>
        <Button color="error" onClick={() => {
          utilityStore.setDrawer({ open: false, content: null })
          deleteNode()
        }}>
          Delete <Delete /><Close />
        </Button>
      </Box>
      <AgentOverlay />
    </Box>
  )
}
