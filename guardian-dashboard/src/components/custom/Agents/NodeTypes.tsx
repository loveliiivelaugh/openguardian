import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';
import { Box, Button, Typography } from '@mui/material';
import FormContainer from '../forms/FormContainer';
import { useSimulator } from '@store/useSimulator';
import { useState } from 'react';
import { useFlowStore } from '@store/v2/flowStore';
import { useAppStore } from '@store/appStore';
import { useUtilityStore } from '@store/index';
import { IconButton, Stack } from '@mui/material';
import SparkleIcon from '@mui/icons-material/AutoFixHigh'; // or any icon
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { NodeInspectModalContent } from './NodeInspectModalContent';

interface AgentFlowStep {
  id: string;
  run: string; // function or agent
  label?: string;
  type?: "agent" | "function" | "condition" | "trigger";
  args?: Record<string, any>;
  config?: {
    default_flow_id?: string;
    assigned_flow_ids?: string[];
    cooldown_seconds?: number;
    behavior?: string;
    context_mode?: string;
    created_by?: string;
  };
  condition?: string;
  forEach?: string;
  steps?: AgentFlowStep[]; // for nested chains
  next?: string[];
}

export interface AgentFlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  type?: 'default' | 'step' | 'conditional' | 'trigger';
}

export const AgentNode = ({ data }: any) => {
  const utilityStore = useUtilityStore();
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleEnrich = async () => {
    console.log("✨ Enriching AgentNode:", data);
    // TODO: replace with actual enrichment logic
    const enriched = await runLLMToEnrichNode(data);
    console.log("Enriched agent data:", enriched);
  };

  const handleInspect = () => {
    utilityStore.setModal({
      open: true,
      sx: {
        slots: {
          box: {
            width: 600,
            height: 800,
            overflow: 'auto',
            padding: 2
          }
        }
      },
      content: (
        <>
          {/* {JSON.stringify(data, null, 2)} */}
          <NodeInspectModalContent node={data} />
        </>
      )
    })
  }

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120 }}
      style={{
        position: 'relative',
        padding: 12,
        border: '2px solid #9f6aff',
        borderRadius: 12,
        background: '#121212',
        color: '#fff',
        minWidth: 160,
      }}
    >
      {/* Hover Actions */}
      {hovered && (
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            mb: 8,
            background: '#1a263b',
            borderRadius: 1,
            p: 0.5,
            zIndex: 10
          }}
        >
          <IconButton size="small" onClick={handleEnrich} title="Enrich with LLM">
            <SparkleIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => setExpanded(true)} title="Edit Node">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleInspect} title="Inspect">
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Stack>
      )}

      <Typography variant="subtitle2" fontWeight={700}>
        🤖 {data.label || 'Agent'}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {data.description || 'AI-powered step'}
      </Typography>

      {/* Output */}
      <Handle type="source" position={Position.Right} id="out" style={{ background: '#7c3aed' }} />
      {/* Input */}
      <Handle type="target" position={Position.Left} id="in" style={{ background: '#7c3aed' }} />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      {expanded && (
        <div style={{ paddingTop: 8 }}>
          <Typography variant="caption">
            <strong>Agent:</strong> {data.run || 'unknown'}
          </Typography>
          <Typography variant="caption">
            <strong>Args:</strong> {JSON.stringify(data.args || {}, null, 2)}
          </Typography>
        </div>
      )}
    </motion.div>
  );
};
export const AgentNodeLegacy = ({ data }: any) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: 'spring', stiffness: 120 }}
    style={{
      padding: 12,
      border: '2px solid #9f6aff',
      borderRadius: 12,
      background: '#121212',
      color: '#fff',
      minWidth: 120,
    }}
  >
    <Typography variant="subtitle2" fontWeight={700}>
      🤖 {data.label || 'Agent'}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {data.description}
    </Typography>
    {/* Output */}
    <Handle type="source" position={Position.Right} id="out" style={{ background: '#7c3aed' }} />

    {/* Input */}
    <Handle type="target" position={Position.Left} id="in" style={{ background: '#7c3aed' }} />

    <Handle type="target" position={Position.Top} />
    <Handle type="source" position={Position.Bottom} />
  </motion.div>
);

export const FunctionNode = ({ data }: any) => {
  const utilityStore = useUtilityStore();
  const simulatorStore = useSimulator();
  const flowStore = useFlowStore();
  const appStore = useAppStore();

  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const flowRunStatus = {
    currentNodeId: data?.config?.id,
    currentNodeName: data?.config?.node_id,
    nodes: flowStore?.nodes,
    totalSteps: flowStore?.nodes?.length,
    currentStep: flowStore?.currentStepId,
    engineStatus: appStore.engineStatus
  };

  const isActive = flowRunStatus.engineStatus?.current_step_id === data.config?.id;
  const isComplete = flowRunStatus.engineStatus?.status === "complete";
  const wasLastNode = flowRunStatus.currentStep === data.config?.id;

  const borderColor = isActive ? "#a855f7" : isComplete && wasLastNode ? "#22c55e" : "#6fafff";
  const boxShadow = isActive ? "0 0 12px #a855f7" : isComplete && wasLastNode ? "0 0 8px #22c55e" : undefined;

  const handleEnrich = async () => {
    console.log("Enriching node:", data);
    // TODO: Replace with your LLM enrich logic
    const enriched = await runLLMToEnrichNode(data);
    simulatorStore.setActiveAgentFlowData(data.config.id, enriched);
  };

  const handleInspect = () => {
    utilityStore.setModal({
      open: true,
      content: (
        <>
          {JSON.stringify(data, null, 2)}
        </>
      )
    })
  }

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'relative',
        padding: 12,
        border: `2px dashed ${borderColor}`,
        borderRadius: 12,
        background: '#0e1a2b',
        color: '#fff',
        minWidth: 240,
        boxShadow,
        transition: 'all 0.3s ease-in-out'
      }}
    >
      {/* Status Dot */}
      <Box sx={{ position: 'absolute', top: -10, right: -10 }}>
        {isActive ? '🟣' : isComplete && wasLastNode ? '✅' : ''}
      </Box>

      {/* Hover Tools */}
      {hovered && (
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            position: 'absolute',
            mb: 4,
            top: 4,
            right: 4,
            background: '#1a263b',
            borderRadius: 1,
            p: 0.5,
            zIndex: 10
          }}
        >
          <IconButton size="small" onClick={handleEnrich} title="Enrich with LLM">
            <SparkleIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => setExpanded(true)} title="Edit Node">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleInspect} title="Inspect">
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Stack>
      )}

      <Typography variant="subtitle2">⚙️ {data.label || 'Function'}</Typography>
      <Typography variant="caption">{data.name}</Typography>

      <Button
        variant="text"
        onClick={() => setExpanded(!expanded)}
        sx={{ color: '#fff', textTransform: 'none', fontSize: 12, fontWeight: 500 }}
      >
        {expanded ? 'Hide' : 'Show'}
      </Button>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      {expanded && (
        <FormContainer
          disableHeader
          disableFooter
          schema={{
            table: "node",
            columns: Object.keys(data.argsSchema).map(key => ({
              name: key,
              type: data.argsSchema[key]?.type,
              required: data.argsSchema[key]?.required,
              default: data.argsSchema[key]?.default
            }))
          }}
          onChange={(field, form) => {
            simulatorStore.setActiveAgentFlowData(data.config.id, {
              [field.name]: field.state.value
            });
          }}
        />
      )}
    </motion.div>
  );
};

// Stub for now – replace this with real LLM enrich logic
async function runLLMToEnrichNode(node: any) {
  const enriched = {
    ...node,
    args: {
      ...node.args,
      enriched: true
    },
    label: node.label || `🔮 Enriched ${node.run || 'Node'}`
  };
  return enriched;
}

export const FunctionNodeLegacy = ({ data }: any) => {
  const simulatorStore = useSimulator()
  const flowStore = useFlowStore();
  const appStore = useAppStore();
  console.log("FunctionNode", data, flowStore, appStore);
  const flowRunStatus = {
    currentNodeId: data?.config?.id,
    currentNodeName: data?.config?.node_id,
    nodes: flowStore?.nodes,
    totalSteps: flowStore?.nodes?.length,
    currentStep: flowStore?.currentStepId,
    engineStatus: appStore.engineStatus
    // engineStatus: {
      // current_flow_id: null
      // current_step_id: null
      // current_step_number: null
      // id: "ed411d1d-ecb6-4125-a928-3ad00c09c3ea"
      // last_updated: "2025-04-30T16:14:06.041+00:00"
      // metadata: Object { activeListeners: 0, activeTasks: 0, activeTimers: 0, … }
      // next_run_at: null
      // status: "complete"
      // total_steps: null
    // }
  };
  console.log({ flowRunStatus })


  const [expanded, setExpanded] = useState(false);

  const isActive = flowRunStatus.engineStatus?.current_step_id === data.config?.id;
  const isComplete = flowRunStatus.engineStatus?.status === "complete";
  const wasLastNode = flowRunStatus.currentStep === data.config?.id;

  const borderColor = isActive
    ? "#a855f7"
    : isComplete && wasLastNode
      ? "#22c55e"
      : "#6fafff";

  const boxShadow = isActive
    ? "0 0 12px #a855f7"
    : isComplete && wasLastNode
      ? "0 0 8px #22c55e"
      : undefined;

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: 12,
        border: `2px dashed ${borderColor}`,
        borderRadius: 12,
        background: '#0e1a2b',
        color: '#fff',
        minWidth: 240,
        boxShadow,
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <Box sx={{ position: 'absolute', top: -10, right: -10 }}>
        {isActive ? '🟣' : isComplete && wasLastNode ? '✅' : ''}
      </Box>

      <Typography variant="subtitle2">⚙️ {data.label || 'Function'}</Typography>
      <Typography variant="caption">{data.name}</Typography>
      <Button
        variant="text"
        onClick={() => setExpanded(!expanded)}
        sx={{
          color: '#fff',
          textTransform: 'none',
          fontSize: 12,
          fontWeight: 500,
        }}
      >
        {expanded ? 'Hide' : 'Show'}
      </Button>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      {console.log("Node data", data) as any}
      {expanded && (
        <FormContainer
          disableHeader
          disableFooter
          schema={{
            table: "node",
            columns: 
            // [
            //   { name: 'to', dataType: 'text' },
            //   { name: 'subject', dataType: 'text' },
            //   { name: 'body', dataType: 'text' }
            // ]
            Object.keys(data.argsSchema).map(key => ({
              name: key,
              type: data.argsSchema[key]?.type,
              required: data.argsSchema[key]?.required,
              default: data.argsSchema[key]?.default
            }))
          }}
          onChange={(field, form) => {
            console.log("is form change registering? ", field)
            simulatorStore.setActiveAgentFlowData(data.config.id, {
              [field.name]: field.state.value
            });
          }}
        />
      )}
    </motion.div>
  );
};

export const TriggerNode = ({ data }: any) => (
  <motion.div
    animate={{ rotate: [0, 5, -5, 0] }}
    transition={{ duration: 0.5, repeat: Infinity, repeatType: 'loop' }}
    style={{
      padding: 12,
      border: '2px solid #ffa726',
      borderRadius: 12,
      background: '#1a1a1a',
      color: '#fff',
    }}
  >
    <Typography variant="subtitle2">🚀 {data.label || 'Trigger'}</Typography>
    <Typography variant="caption">{data.metadata?.description}</Typography>
    <Handle type="source" position={Position.Bottom} />
  </motion.div>
);

    