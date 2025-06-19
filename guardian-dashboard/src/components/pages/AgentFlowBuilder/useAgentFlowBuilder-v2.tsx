import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useFlowStore } from '@/utilities/store/useFlowStore';
import { saveFlowToDB } from '@/utilities/flows/saveFlowToDB';
import { validateAgentFlow } from '@/utilities/flows/validateAgentFlow';
import { supabase } from '@/config/supabase.config';
import { AgentFlowStep } from '@/utilities/flow-schema';

export function useAgentFlowBuilder() {
  const { flowId: flowIdFromUrl } = useParams();
  const {
    flowId,
    flowName,
    steps,
    nodes,
    edges,
    selectedNodeId,
    setFlowMetadata,
    setSteps,
    setNodes,
    setEdges,
    updateNodeData,
    setSelectedNode,
  } = useFlowStore();

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  // Load the flow on mount
  useEffect(() => {
    if (!flowIdFromUrl) return;
    fetchFlow(flowIdFromUrl);
  }, [flowIdFromUrl]);

  async function fetchFlow(id: string) {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('agent_flows')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('fetchFlow.error:', error);
      setIsLoading(false);
      return;
    }

    const { name, steps } = data;
    setFlowMetadata(id, name);
    setSteps(steps || []);
    setIsLoading(false);
  }

  async function onSaveFlow() {
    try {
      if (!flowIdFromUrl) return;
      const { valid, errors } = validateAgentFlow(steps);
      if (!valid) {
        console.error('Flow validation failed:', errors);
        throw new Error('Cannot save invalid flow.');
      }

      setIsSaving(true);
      await saveFlowToDB(flowIdFromUrl);
      setIsSaving(false);
    } catch (error) {
      console.error('onSaveFlow.error:', error);
      setIsSaving(false);
    }
  }

  function onUpdateNodeData(newData: any) {
    if (!selectedNodeId) return;
    updateNodeData(selectedNodeId, {
      ...selectedNode?.data,
      ...newData,
    });
  }

  function onAddAgentNode(position = { x: 0, y: 0 }) {
    const newNode = {
      id: crypto.randomUUID(),
      type: 'agent',
      position,
      data: {
        label: 'New Agent',
        type: 'agent',
        run: 'runAgent',
        args: {},
        config: {
          behavior: 'default',
          context_mode: 'standard',
          cooldown_seconds: 30,
          created_by: 'guardian',
          default_flow_id: '',
          assigned_flow_ids: [],
        },
      },
    };
    setNodes([...nodes, newNode]);
  }

  return {
    isLoading,
    isSaving,
    flowId,
    flowName,
    steps,
    nodes,
    edges,
    selectedNode,
    onSaveFlow,
    onUpdateNodeData,
    onAddAgentNode,
    setSelectedNode,
    setNodes,
    setEdges,
  };
}
