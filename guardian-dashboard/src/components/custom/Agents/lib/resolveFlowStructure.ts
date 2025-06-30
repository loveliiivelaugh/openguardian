// @lib/resolveFlowStructure.ts
import type { Edge, Node } from 'reactflow'

export type AgentFlowNode = {
  id: string
  type: string
  data: {
    label: string
    type: string
    config: Record<string, any>
  }
  next: string[]
  position?: { x: number; y: number }
}

export function resolveFlowStructure(nodes: Node[], edges: Edge[]): AgentFlowNode[] {
  // Build a lookup table of outgoing edges by source
  const connectionMap: Record<string, string[]> = {}

  edges.forEach((edge) => {
    if (!connectionMap[edge.source]) {
      connectionMap[edge.source] = []
    }
    connectionMap[edge.source].push(edge.target)
  })

  // Build new enriched node structure
  const structured: AgentFlowNode[] = nodes.map((node) => ({
    id: node.id,
    type: node.type || 'default',
    data: {
      label: node.data?.label || 'Unnamed',
      type: node.data?.type || 'generic',
      config: node.data?.config || {}
    },
    next: connectionMap[node.id] || [],
    position: node.position
  }))

  return structured
}
