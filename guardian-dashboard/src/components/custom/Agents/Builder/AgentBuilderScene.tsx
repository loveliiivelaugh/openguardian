// @components/AgentFlow/Agent3D.tsx
import type { AgentAnimationState, AgentInstance } from './agentAvatarsConfig';
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Stars, Float, useGLTF } from '@react-three/drei'
import { Suspense } from 'react'
import { Box } from '@mui/material'
import { AgentGroup } from './AgentGroup';
import { AgentAvatar } from './AgentBuilderCharacter2';
// import { AgentAvatar } from '@components/Custom/Agents/Builder/AgentBuilderCharacter' // swap with glTF model later

const EmoteOverlay = ({
  agentStates,
  agentConfig
}: {
  agentStates: Record<string, AgentAnimationState>
  agentConfig: AgentInstance[]
}) => {
  return (
    <>
      {agentConfig.map((agent) => {
        const state = agentStates[agent.id]
        const emote =
          state === 'celebrating' ? '🎉' :
          state === 'thinking' ? '💭' :
          state === 'error' ? '⚠️' : null

        if (!emote) return null

        return (
          <Box
            key={agent.id}
            sx={{
              position: 'absolute',
              left: `${agent.position[0] * 80 + 300}px`,
              top: `${-agent.position[1] * 80 + 250}px`,
              pointerEvents: 'none',
              fontSize: '2rem',
              opacity: 0.95,
              transform: 'translate(-50%, -50%)',
              animation: 'float 2s ease-in-out infinite'
            }}
          >
            {emote}
          </Box>
        )
      })}
    </>
  )
}

export default function Agent3D({ ...props }: any) {
  return (
    <>
      <Canvas style={{ height: 800, width: '100%' }} camera={{ position: [0, 2, -30], rotation: [180, 40, 0], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 2]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} />
        <Suspense fallback={null}>
          <Float floatIntensity={2} speed={2}>
            <AgentAvatar animationState={"sleeping"} {...props} />
          </Float>
          <Float floatIntensity={2} speed={2}>
            <AgentGroup />
          </Float>
          <Float floatIntensity={2} speed={2}>
            <AgentAvatar 
              animationState={"idle"} //TODO: get dynamic agent state from backend
              position={[0, 1, -2]}
              type="dev-agent"
              expression="neutral"
              color="#88f"
              onClick={props.onAgentClick}
            />
          </Float>
          <Float floatIntensity={2} speed={2}>
            <AgentAvatar 
              animationState={"thinking"}  //TODO: get dynamic agent state from backend
              position={[2, 4, -4]} 
              type="qa-agent"
              expression="neutral"
              color="#8f2"
              onClick={props.onAgentClick}
            />
          </Float>
          <Float floatIntensity={2} speed={2}>
            <AgentAvatar 
              animationState={"celebrating"}  //TODO: get dynamic agent state from backend
              position={[-2, 4, -4]}
              type="pm-agent"
              expression="neutral"
              color="#f88"
              onClick={props.onAgentClick}
            />
          </Float>
          <OrbitControls enablePan={false} />
          <Environment preset="city" />
          {/* <group ref={null} position={[0, 0, 0]}>
            <primitive object={{}} />
            {['executing', 'typing', 'celebrating'].includes(animationState) && (
              <pointLight position={[0, 1.5, 0]} intensity={1.2} distance={5} />
            )}
          </group> */}
        </Suspense>
      </Canvas>
      {/* <EmoteOverlay agentStates={{
        'pm': 'celebrating',
        'dev': 'thinking',
        'qa': 'idle'
      }} agentConfig={[
        { id: 'pm', type: 'pm-agent', position: [-2, -1, 0] },
        { id: 'dev', type: 'dev-agent', position: [0, -1, 0] },
        { id: 'qa', type: 'qa-agent', position: [2, -1, 0] }
      ]}  /> */}
    </>
  )
}

useGLTF.preload('/assets/starter_avatar1.glb'); // Preload your default
