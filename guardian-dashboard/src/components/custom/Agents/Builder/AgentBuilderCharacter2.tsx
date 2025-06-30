// components/Custom/Agents/Builder/AgentBuilderCharacter.tsx
import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { agentAvatars, agentStateAnimations } from './agentAvatarsConfig'

type Props = {
  url?: string
  type?: keyof typeof agentAvatars
  animationState?: string
  expression?: string
  color?: string
  position?: [number, number, number]
  onClick?: (event: React.MouseEvent) => void
}

export function AgentAvatar({
  url,
  type = 'dev-agent',
  animationState = 'idle',
  expression = 'neutral',
  color = '#ffffff',
  position = [0, 0, 0],
  onClick
}: Props) {
  const config = agentAvatars[type] || agentAvatars['dev-agent']
  const gltf = useGLTF(url || config.modelUrl)

  // 🧠 Clone scene + materials
  const clonedScene = useMemo(() => {
    const cloned = gltf.scene.clone(true)
    cloned.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone()
        child.material.color.set(color || config.color)
      }
    })
    return cloned
  }, [gltf, color, config.color])

  const ref = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const state = agentStateAnimations[animationState as keyof typeof agentStateAnimations]
  
    if (ref.current) {
      if (state?.rotation) {
        ref.current.rotation.y += state.rotation
      }
      if (state?.bounce) {
        ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 4) * 0.2
      }
    }
  })

  useEffect(() => {
    const state = agentStateAnimations[animationState as keyof typeof agentStateAnimations]
  
    if (ref.current) {
      ref.current.traverse((child: any) => {
        if (child.isMesh && child.material && state?.color) {
          child.material.color.set(state.color)
        }
      })
    }
  }, [animationState])

  return <primitive ref={ref} object={clonedScene} position={position} onClick={onClick} />
}
