// components/AgentOverlay.tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { AgentGroup } from './AgentGroup'

export function AgentOverlay() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Canvas camera={{ position: [0, 1.5, 5], fov: 35 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.9} />
        <AgentGroup />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate />
      </Canvas>
    </div>
  )
}
