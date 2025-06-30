import { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import useUtilityStore from '@store/utilityStore'
import { Chip, Modal, Box, Button } from '@mui/material'

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    maxWidth: "100vw",
    bgcolor: '#fcfcfc',
    border: '1px solid #444',
    borderRadius: '16px',
    boxShadow: 24,
    p: 4,
}

const DOT_COUNT = 2500 // increase dot density
const SPHERE_RADIUS = 10 // make the sphere bigger

// Mocked memory data fetch (replace with actual Qdrant/Supabase call)
async function fetchMemories() {
  return Array.from({ length: DOT_COUNT }, (_, i) => ({
    id: `mem-${i}`,
    summary: `This is a summary of memory item #${i}.`,
    type: 'summary',
    cluster: i % 12, // simulate more clusters
    timestamp: Date.now() - (i * 60000)
  }))
}

function MemoryDotSphere() {
  const utilityStore = useUtilityStore();
  const [modalOpen, setModalOpen] = useState(false);
  const meshRef = useRef<THREE.Points>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [hoveredPos, setHoveredPos] = useState<[number, number, number] | null>(null)
  const [memories, setMemories] = useState<any[]>([])
  const positionsRef = useRef<Float32Array | null>(null)

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
    const arr = new Float32Array(points)
    positionsRef.current = arr
    return arr
  }, [])

  const colors = useMemo(() => {
    const colorArray = new Float32Array(DOT_COUNT * 3)
    const color = new THREE.Color()
    for (let i = 0; i < DOT_COUNT; i++) {
      const h = (memories[i]?.cluster ?? i) / 12
      color.setHSL(h, 0.7, 0.5)
      color.toArray(colorArray, i * 3)
    }
    return colorArray
  }, [memories])

  useFrame(({ clock }) => {
    if (!meshRef.current || !positionsRef.current) return
    const time = clock.getElapsedTime()
    const posAttr = meshRef.current.geometry.attributes.position
    for (let i = 0; i < DOT_COUNT; i++) {
      const i3 = i * 3
      const offset = Math.sin(time + i) * 0.04
      posAttr.setXYZ(
        i,
        positionsRef.current[i3] + offset,
        positionsRef.current[i3 + 1] + offset,
        positionsRef.current[i3 + 2] + offset
      )
    }
    posAttr.needsUpdate = true

    const sizes = meshRef.current.geometry.attributes.size
    for (let i = 0; i < DOT_COUNT; i++) {
      const scale = hoveredIndex === i ? 2.5 : 1.0 + Math.sin(time + i) * 0.1
      sizes.setX(i, scale)
    }
    sizes.needsUpdate = true
  })

  const memory = hoveredIndex !== null ? memories[hoveredIndex] : null

  const insertMemoryIntoPrompt = (memoryId: string) => {
    // TODO: Implement memory insertion into prompt
  }

  return (
    <>
      <Html>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box sx={modalStyle}>
            <Chip label="Summary" color="primary" variant="outlined" />
            <h6>
              Memory Details
            </h6>
            <h4 style={{ borderLeft: "4px solid #444", paddingLeft: 8 }}>🔗 Used in Step: Agent Node #3</h4>
            <p>{memories[0]?.summary}</p>
            <div style={{ 
                padding: '4px 8px', 
                borderTop: '1px solid #444', 
                borderBottom: '1px solid #444', 
                borderRadius: 4, 
                fontSize: 12,
                marginBottom: "16px"
              }}
            >
              <strong>{memories[0]?.id}</strong>
              <div>Type: {memories[0]?.type}</div>
              <div>Cluster: Topic {memories[0]?.cluster}</div>
              <div style={{ marginTop: 4 }}>{memories[0]?.summary}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'right' }}>
              <Button>Learn More</Button>
              <Button variant="text" onClick={() => insertMemoryIntoPrompt(memories[0]?.id)}>
                Insert into Prompt
              </Button>
            </div>
          </Box>
        </Modal>
      </Html>
      <points
        ref={meshRef}
        onPointerMove={(e) => {
          setHoveredIndex(e.index ?? null)
          if (e.point) {
            setHoveredPos([e.point.x, e.point.y, e.point.z])
          }
        }}
        onPointerOut={() => setHoveredIndex(null)}
        onPointerDown={(e) => {
          e.stopPropagation()
          setHoveredIndex(e.index ?? null)
          // setHoveredIndex(null)
          setModalOpen(true)
        }}
        // onPointerDown={() => utilityStore.setModal({
        //     open: true,
        //     content: (
        //         <Html style={{ pointerEvents: 'none' }}>
        //             <h6>
        //                 Memory Details
        //             </h6>
        //             <p>{memory?.summary}</p>
        //         </Html>
        //     )
        // })}
      >
        <bufferGeometry>
          <primitive
            object={new THREE.BufferAttribute(positions, 3)}
            attach="attributes-position"
          />
          <primitive
            object={new THREE.BufferAttribute(colors, 3)}
            attach="attributes-color"
          />
          <primitive
            object={new THREE.BufferAttribute(new Float32Array(DOT_COUNT).fill(1), 1)}
            attach="attributes-size"
          />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.15}
          sizeAttenuation
        />
      </points>

      {hoveredIndex !== null && hoveredPos && memory && (
        <Html position={hoveredPos} style={{ pointerEvents: 'none', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>
            <strong>{memory.id}</strong>
            <div>Type: {memory.type}</div>
            <div>Cluster: Topic {memory.cluster}</div>
            <div style={{ marginTop: 4 }}>{memory.summary}</div>
          </div>
        </Html>
      )}
    </>
  )
}

export default function MemorySphereScene() {
  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 60 }} shadows style={{ height: '240px' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls enableZoom enablePan enableRotate />
      <MemoryDotSphere />
    </Canvas>
  )
}
