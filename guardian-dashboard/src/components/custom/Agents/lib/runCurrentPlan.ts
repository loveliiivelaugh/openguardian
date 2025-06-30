import { useFlowStore } from '@store/v2/flowStore';
import { supabase } from '@api/supabase';
import { canvasToSteps } from './canvasToSteps';
import { useAppStore } from '@store/appStore';


export async function runCurrentFlow(
  { mutate, handleFlowContext }: 
  { 
    mutate: (payload: any, options: { onSuccess: (result: any) => void }) => void, 
    handleFlowContext: (result: any) => void 
  }
) {
  const { nodes, edges, flowId, flowName } = useFlowStore.getState();

  if (!nodes.length) return console.warn('No nodes to run');

  try {
    console.log('📝 Saving flow before running...');

    const payload = {
      name: flowName || 'Untitled Flow',
      nodes,
      edges,
      status: 'ready',
      created_by: 'guardian',
    };

    // Save or update the flow in Supabase
    let finalFlowId = flowId;

    if (!flowId) {
      const { data, error } = await supabase
        .from('agent_flows')
        .insert(payload)
        .select('id')
        .single();

      if (error) throw error;
      finalFlowId = data.id;
    } else {
      await supabase.from('agent_flows').update(payload).eq('id', flowId);
    }

    console.log('✅ Flow saved. Triggering backend run...');
    const plan = canvasToSteps(nodes, edges);

    // Call backend route to execute
    await mutate({
      id: finalFlowId,
      plan: {
        id: finalFlowId,
        trigger: 'manual',
        steps: plan
      },
      flow: {
        nodes,
        edges,
        metadata: {
            name: payload.name,
            id: finalFlowId,
            startedAt: new Date().toISOString()
        }
      }
    }, {
        onSuccess: (runResult) => {
            console.log('✅ Flow executed successfully');
            console.log('🧠 Execution result:', runResult);
            // Optionally show results in UI
            // openResultsDrawer(runResult);
            useAppStore.getState().setEngineStatus({
              ...useAppStore.getState().engineStatus,
              runResult
            });
            handleFlowContext(runResult);
        }
    })

  } catch (err) {
    console.error('❌ Failed to run flow from client:', err);
  }
}
