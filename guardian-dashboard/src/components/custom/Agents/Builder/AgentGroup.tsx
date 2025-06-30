// components/3D/AgentGroup.tsx
import { AgentAvatar } from '@components/Custom/Agents/Builder/AgentBuilderCharacter'
import { agentAvatars } from '@components/Custom/Agents/Builder/agentAvatarsConfig'
import { useEffect, useState } from 'react'
import { mapFlowStepToAnimation } from '@hooks/useAnimationState'
import { useWebSocketStore } from '@hooks/useWebsocket' // or Supabase Realtime equivalent

type AgentAnimationState = 'idle' | 'active' | 'executing' | 'error'

type AgentInstance = {
  id: string // unique ID for agent (can be agentId or flowNodeId)
  type: keyof typeof agentAvatars
  position: [number, number, number]
}

const agents: AgentInstance[] = [
  { id: 'pm', type: 'pm-agent', position: [-2, -1, 0] },
  { id: 'dev', type: 'dev-agent', position: [0, -1, 0] },
  { id: 'qa', type: 'qa-agent', position: [2, -1, 0] },
]

export function AgentGroup() {
  const [animationStates, setAnimationStates] = useState<Record<string, AgentAnimationState>>(() =>
    Object.fromEntries(agents.map((a) => [a.id, 'idle']))
  )

  const updateAgentState = (agentId: string, state: AgentAnimationState, autoReset = true) => {
    setAnimationStates((prev) => ({
      ...prev,
      [agentId]: state,
    }))
  
    // Reset to idle after 4s unless it's an error or sleeping
    if (autoReset && !['error', 'sleeping'].includes(state)) {
      setTimeout(() => {
        setAnimationStates((prev) => ({
          ...prev,
          [agentId]: 'idle',
        }))
      }, 4000)
    }
  }

  // TODO: Fix websocket to point to production server
  // 🎯 Listen to flowStepEvent from socket or realtime
  const { socket }: any = useWebSocketStore() // Your WebSocket hook or replace with Supabase logic

  useEffect(() => {
    const handleStep = (event: any) => {
      const { agentId, stepType } = event
      const state = mapFlowStepToAnimation(stepType)
      updateAgentState(agentId, state)
    }

    // socket?.on('flowStepEvent', handleStep)
    return () => {
    //   socket?.off('flowStepEvent', handleStep)
    }
  }, [socket])

  return (
    <group position={[0, 0, 0]}>
      {agents.map((agent) => (
        <AgentAvatar
          key={agent.id}
          type={agent.type}
          url={agentAvatars[agent.type].modelUrl}
          position={agent.position}
          animationState={animationStates[agent.id] ?? 'idle'}
        />
      ))}
    </group>
  )
}
