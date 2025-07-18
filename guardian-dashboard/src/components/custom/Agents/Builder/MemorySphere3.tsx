import React, { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'

const DOT_COUNT = 500
const SPHERE_RADIUS = 5

// Mocked memory data fetch (replace with actual Qdrant/Supabase call)
async function fetchMemories() {
  return Array.from({ length: DOT_COUNT }, (_, i) => ({
    id: `mem-${i}`,
    summary: `This is a summary of memory item #${i}.`,
    type: 'summary',
    cluster: `Topic ${i % 5}`,
  }))
}

function MemoryDotSphere() {
  const meshRef = useRef<THREE.Points>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [hoveredPos, setHoveredPos] = useState<[number, number, number] | null>(null)
  const [memories, setMemories] = useState<any[]>([])

  useEffect(() => {
    fetchMemories().then(setMemories)
  }, [])

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

  const colors = useMemo(() => {
    const colorArray = new Float32Array(DOT_COUNT * 3)
    const color = new THREE.Color()
    for (let i = 0; i < DOT_COUNT; i++) {
      color.setHSL(i / DOT_COUNT, 0.7, 0.5)
      color.toArray(colorArray, i * 3)
    }
    return colorArray
  }, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const time = clock.getElapsedTime()
    const sizes = meshRef.current.geometry.attributes.size
    for (let i = 0; i < DOT_COUNT; i++) {
      const scale = hoveredIndex === i ? 2.5 : 1.0 + Math.sin(time + i) * 0.1
      sizes.setX(i, scale)
    }
    sizes.needsUpdate = true
  })

  const memory = hoveredIndex !== null ? memories[hoveredIndex] : null

  return (
    <>
      <points
        ref={meshRef}
        onPointerMove={(e) => {
          setHoveredIndex(e.index ?? null)
          if (e.point) {
            setHoveredPos([e.point.x, e.point.y, e.point.z])
          }
        }}
        onPointerOut={() => setHoveredIndex(null)}
      >
        <bufferGeometry>
          {/* @ts-ignore */}
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          {/* @ts-ignore */}
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
          {/* @ts-ignore */}
          <bufferAttribute
            attach="attributes-size"
            count={DOT_COUNT}
            array={new Float32Array(DOT_COUNT).fill(1)}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.1}
          sizeAttenuation
        />
      </points>

      {hoveredIndex !== null && hoveredPos && memory && (
        <Html position={hoveredPos} style={{ pointerEvents: 'none' }}>
          <div style={{ background: 'white', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>
            <strong>{memory.id}</strong>
            <div>Type: {memory.type}</div>
            <div>Cluster: {memory.cluster}</div>
            <div style={{ marginTop: 4 }}>{memory.summary}</div>
          </div>
        </Html>
      )}
    </>
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
