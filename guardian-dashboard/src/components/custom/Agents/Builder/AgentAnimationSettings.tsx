import { Box, Button, Typography } from '@mui/material';
import type { AgentAnimationState, AgentInstance } from './agentAvatarsConfig';

const states: AgentAnimationState[] = ['idle', 'thinking', 'typing', 'celebrating', 'error', 'sleeping']
const agents: AgentInstance[] = [
  { id: 'pm', type: 'pm-agent', position: [-2, -1, 0] },
  { id: 'dev', type: 'dev-agent', position: [0, -1, 0] },
  { id: 'qa', type: 'qa-agent', position: [2, -1, 0] }
]
const AgentAnimationSettings = ({ updateAgentState }: { updateAgentState: (id: string, state: AgentAnimationState) => void }) => {
  return (
        <Box sx={{ position: 'absolute', top: 20, right: 20, bgcolor: 'white', p: 2, borderRadius: 2 }}>
        {agents.map((agent) => (
            <Box key={agent.id} sx={{ mb: 2 }}>
            <Typography>{agent.id.toUpperCase()}</Typography>
            {states.map((s) => (
                <Button
                key={s}
                size="small"
                variant="outlined"
                sx={{ m: 0.5 }}
                onClick={() => updateAgentState(agent.id, s)}
                >
                {s}
                </Button>
            ))}
            </Box>
        ))}
        </Box>
  )
}

export default AgentAnimationSettings;