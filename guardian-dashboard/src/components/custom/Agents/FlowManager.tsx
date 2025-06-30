import { Box, Typography, Divider, Stack } from '@mui/material';
import { useEffect, useState } from 'react';

// Assume you can fetch or subscribe to this data
// import { flowManager } from '@engine/flowManager'; // your live state!
const flowManager = {
  activeFlowId: null,
  flowStatus: 'stopped',
  activeTasks: {},
  timers: [],
  listeners: [],
};

const eventRegistry: Record<string, any> = {};

export function FlowDebuggerPanel() {
  const [flowId, setFlowId] = useState<string | null>(null);
  const [flowStatus, setFlowStatus] = useState<string>('stopped');
  const [taskCount, setTaskCount] = useState<number>(0);
  const [timerCount, setTimerCount] = useState<number>(0);
  const [listenerCount, setListenerCount] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlowId(flowManager.activeFlowId);
      setFlowStatus(flowManager.flowStatus);
      setTaskCount(Object.keys(flowManager.activeTasks).length);

      const activeRegistry = flowManager.activeFlowId ? eventRegistry[flowManager.activeFlowId] : null;
      setTimerCount(activeRegistry?.timers.length || 0);
      setListenerCount(activeRegistry?.listeners.length || 0);
    }, 1000); // update every second

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{
      p: 2,
      backgroundColor: '#1e1e1e',
      borderRadius: 2,
      color: '#90caf9',
      fontFamily: 'monospace',
      width: 300,
    }}>
      <Typography variant="h6" gutterBottom>🚀 Flow Debugger</Typography>
      <Divider sx={{ mb: 2, backgroundColor: '#444' }} />
      <Stack spacing={1}>
        <Typography variant="body2">🆔 Flow ID: {flowId ?? 'None'}</Typography>
        <Typography variant="body2">🎯 Status: {flowStatus}</Typography>
        <Typography variant="body2">📝 Active Tasks: {taskCount}</Typography>
        <Typography variant="body2">⏱️ Active Timers: {timerCount}</Typography>
        <Typography variant="body2">🔗 Active Listeners: {listenerCount}</Typography>
      </Stack>
    </Box>
  );
}
