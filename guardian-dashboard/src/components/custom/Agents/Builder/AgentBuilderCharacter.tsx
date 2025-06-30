// components/3D/AgentAvatar.tsx
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { agentAvatars } from '@components/Custom/Agents/Builder/agentAvatarsConfig'

type AgentAvatarProps = {
  url?: string
  type?: keyof typeof agentAvatars
  animationState?: 'idle' | 'hover' | 'active' | 'executing' | 'error'
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  spin?: boolean
}

export function AgentAvatar({
  url = '/models/starter_avatar1.glb',
  type = 'dev-agent',
  animationState = 'idle',
  position,
  rotation,
  scale,
  spin = true,
}: AgentAvatarProps) {
  const config: {
    name: string;
    glb: string;
    color: string;
    defaultRotation: [number, number, number];
    defaultPosition: [number, number, number];
    scale: number;
  } | any = agentAvatars[type] || agentAvatars['dev-agent']
  const ref = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(url)
  const { actions } = useAnimations(animations, ref)

  useFrame((_, delta) => {
    if (spin && ref.current) {
      ref.current.rotation.y += delta * 0.5
    }
  })

  // Update animation when animationState changes
  useEffect(() => {
    const actionName = config.animations?.[animationState] || 'idle'
    const action = actions[actionName]

    if (action) {
      action.reset().fadeIn(0.2).play()
      return () => {
        action.fadeOut(0.2)
      }
    }
  }, [animationState, actions, config.animations])

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={scale ?? config.scale ?? 1}
      position={position ?? config.defaultPosition ?? [0, -1, 0]}
      rotation={rotation ?? config.defaultRotation ?? [0, 0, 0]}
    />
  )
}
