import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

const DOT_COUNT = 500
const SPHERE_RADIUS = 5

function MemoryDotSphere() {
  const positions = useMemo(() => {
    const points = []
    for (let i = 0; i < DOT_COUNT; i++) {
      const phi = Math.acos(1 - 2 * Math.random())
      const theta = 2 * Math.PI * Math.random()
      const x = SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta)
      const y = SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta)
      const z = SPHERE_RADIUS * Math.cos(phi)
      points.push(x, y, z)
    }
    return new Float32Array(points)
  }, [])

  return (
    <points>
      <bufferGeometry attach="geometry">
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        color="#66ccff"
        size={0.08}
        sizeAttenuation
      />
    </points>
  )
}

export default function MemorySphereScene() {
  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 60 }} shadows>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls enableZoom enablePan enableRotate />
      <MemoryDotSphere />
    </Canvas>
  )
}
