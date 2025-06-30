// shared/agentStates.ts
export type AgentAnimationState = 'idle' | 'typing' | 'thinking' | 'celebrating' | 'error' | 'sleeping'

export const agentStateAnimations: Record<AgentAnimationState, { rotation?: number; bounce?: boolean; color?: string }> = {
  idle:         { rotation: 0.002 },
  thinking:     { rotation: 0.01, color: '#fff176' },
  typing:       { bounce: true, color: '#4fc3f7' },
  celebrating:  { rotation: 0.03, bounce: true, color: '#81c784' },
  error:        { rotation: 0, color: '#e57373' },
  sleeping:     { rotation: 0.001, color: '#90a4ae' }
}

export type AgentInstance = {
  id: string
  type: string
  position: [number, number, number]
  scale?: number
  rotation?: [number, number, number]
  animations?: Record<AgentAnimationState, { rotation?: number; bounce?: boolean; color?: string }>
}

export interface Agent {
    id: string; // e.g. "dev-agent"
    label: string; // Human-friendly label: "Developer Agent"
    flowId: string; // Agent's active AgentFlow ID
    role?: 'developer' | 'qa' | 'pm' | 'docwriter' | 'support' | string; // flexible for custom types
    enabled: boolean; // Toggle agent activity
    avatarUrl?: string; // Optional image for dashboard/avatar display
    description?: string; // What the agent is responsible for
    assignedTasks?: string[]; // Optional: live or historical task IDs
    createdAt?: string;
    updatedAt?: string;
    metadata?: Record<string, any>; // Arbitrary JSON for additional info
}

// config/agentAvatarConfigs.ts
export const agentAvatars = {
    'qa-agent': {
        name: 'QA',
        modelUrl: '/models/starter_avatar1.glb',
        color: '#2196f3',
        defaultRotation: [0, Math.PI / 2, 0],
        defaultPosition: [0, -1, 0] as [number, number, number],
        scale: 1.2,
        animations: {
            idle: 'Idle',
            executing: 'Typing',
            active: 'Nod',
            error: 'Shake',
        },
    },
    'sentinel-agent': {
        name: 'Sentinel',
        modelUrl: '/models/starter_avatar1.glb',
        color: '#9c27b0',
        defaultRotation: [0, Math.PI / 2, 0],
        defaultPosition: [0, -1, 0] as [number, number, number],
        scale: 1.2,
        animations: {
            idle: 'Stand',
            executing: 'Point',
            error: 'Sigh',
        },
    },
    'dev-agent': {
        label: 'Developer',
        modelUrl: '/models/starter_avatar1.glb',
        color: '#2196F3',
        defaultPosition: [0, -1, 0] as [number, number, number],
        defaultRotation: [0, 0.5, 0] as [number, number, number],
        scale: 1.2,
        animations: {
            idle: 'Stand',
            executing: 'Point',
            error: 'Sigh',
        },
    },
    'pm-agent': {
        label: 'Project Manager',
        modelUrl: '/models/starter_avatar1.glb',
        color: '#FFC107',
        defaultPosition: [-2, -1, 0],
        defaultRotation: [0, -0.3, 0],
        scale: 1.1,
        animations: {
            idle: 'Idle',
            executing: 'Typing',
            active: 'Nod',
            error: 'Shake',
        },
    },
}
