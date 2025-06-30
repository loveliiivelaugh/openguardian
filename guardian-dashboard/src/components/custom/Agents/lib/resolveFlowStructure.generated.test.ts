import { describe, it, expect } from 'vitest';
import { resolveFlowStructure, AgentFlowNode } from '../lib/resolveFlowStructure';
// @ts-expect-error
import { Node, Edge } from 'reactflow'; // Import types for Node and Edge


describe('resolveFlowStructure', () => {
  it('should return an empty array if no nodes are provided', () => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const result = resolveFlowStructure(nodes, edges);
    expect(result).toEqual([]);
  });

  it('should correctly resolve a simple flow structure with one node and no edges', () => {
    const nodes: Node[] = [
      {
        id: '1',
        type: 'input',
        data: { label: 'Start', type: 'start', config: {} },
        position: { x: 100, y: 100 },
      },
    ];
    const edges: Edge[] = [];

    const expected: AgentFlowNode[] = [
      {
        id: '1',
        type: 'input',
        data: { label: 'Start', type: 'start', config: {} },
        next: [],
        position: { x: 100, y: 100 },
      },
    ];

    const result = resolveFlowStructure(nodes, edges);
    expect(result).toEqual(expected);
  });

  it('should correctly resolve a flow structure with multiple nodes and edges', () => {
    const nodes: Node[] = [
      {
        id: '1',
        type: 'input',
        data: { label: 'Start', type: 'start', config: {} },
        position: { x: 100, y: 100 },
      },
      {
        id: '2',
        type: 'middle',
        data: { label: 'Process', type: 'process', config: { someValue: 'test' } },
        position: { x: 300, y: 100 },
      },
      {
        id: '3',
        type: 'output',
        data: { label: 'End', type: 'end', config: {} },
        position: { x: 500, y: 100 },
      },
    ];
    const edges: Edge[] = [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
    ];

    const expected: AgentFlowNode[] = [
      {
        id: '1',
        type: 'input',
        data: { label: 'Start', type: 'start', config: {} },
        next: ['2'],
        position: { x: 100, y: 100 },
      },
      {
        id: '2',
        type: 'middle',
        data: { label: 'Process', type: 'process', config: { someValue: 'test' } },
        next: ['3'],
        position: { x: 300, y: 100 },
      },
      {
        id: '3',
        type: 'output',
        data: { label: 'End', type: 'end', config: {} },
        next: [],
        position: { x: 500, y: 100 },
      },
    ];

    const result = resolveFlowStructure(nodes, edges);
    expect(result).toEqual(expected);
  });

  it('should handle nodes with missing data fields and default values', () => {
    const nodes: Node[] = [
      { id: '1', position: { x: 100, y: 100 } },
      { id: '2', type: 'custom', position: { x: 200, y: 200 }, data: {} },
    ];
    const edges: Edge[] = [];

    const expected: AgentFlowNode[] = [
      {
        id: '1',
        type: 'default',
        data: { label: 'Unnamed', type: 'generic', config: {} },
        next: [],
        position: { x: 100, y: 100 },
      },
      {
        id: '2',
        type: 'custom',
        data: { label: 'Unnamed', type: 'generic', config: {} },
        next: [],
        position: { x: 200, y: 200 },
      },
    ];

    const result = resolveFlowStructure(nodes, edges);
    expect(result).toEqual(expected);
  });

  it('should correctly handle multiple outgoing edges from a single node', () => {
    const nodes: Node[] = [
      { id: '1', data: { label: 'Node 1' }, position: { x: 100, y: 100 } },
      { id: '2', data: { label: 'Node 2' }, position: { x: 200, y: 100 } },
      { id: '3', data: { label: 'Node 3' }, position: { x: 300, y: 100 } },
    ];
    const edges: Edge[] = [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e1-3', source: '1', target: '3' },
    ];

    const expected: AgentFlowNode[] = [
      {
        id: '1',
        type: 'default',
        data: { label: 'Node 1', type: 'generic', config: {} },
        next: ['2', '3'],
        position: { x: 100, y: 100 },
      },
      {
        id: '2',
        type: 'default',
        data: { label: 'Node 2', type: 'generic', config: {} },
        next: [],
        position: { x: 200, y: 100 },
      },
      {
        id: '3',
        type: 'default',
        data: { label: 'Node 3', type: 'generic', config: {} },
        next: [],
        position: { x: 300, y: 100 },
      },
    ];

    const result = resolveFlowStructure(nodes, edges);
    expect(result).toEqual(expected);
  });

  it('should handle edges pointing to non-existent nodes', () => {
      const nodes: Node[] = [
          { id: '1', data: { label: 'Node 1' }, position: {x: 100, y: 100} }
      ];
      const edges: Edge[] = [
          { id: 'e1-2', source: '1', target: '2' }
      ];

      const expected: AgentFlowNode[] = [
          {
              id: '1',
              type: 'default',
              data: {label: 'Node 1', type: 'generic', config: {}},
              next: ['2'],
              position: {x: 100, y: 100}
          }
      ];

      const result = resolveFlowStructure(nodes, edges);
      expect(result).toEqual(expect.arrayContaining(expected))
      expect(result.length).toBe(1);

  });
}