export type NodeLibraryItem = {
    id: string;
    label: string;
    description: string;
    category: 'Communication' | 'Control Flow' | 'Data Operations' | 'Integrations' | 'System Utilities';
    argsSchema: Record<string, {
        type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'any';
        required: boolean;
        default?: any;
    }>;
    handler: string | ((...args: any[]) => any);
};
export type ArgSchemaType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'any';
export interface AgentFlowNode {
    // 🎯 Core identity
    id: string;                        // UUID or unique name
    label?: string;                   // Display name
    run: string;                      // Name of the function/agent to execute
    type?: 'function' | 'agent' | 'condition' | 'trigger' | 'integration' | 'log' | 'memory' | 'default'; // Visual & behavioral type

    // 🧩 Node library metadata (used for sidebar and introspection)
    description?: string;
    category?: 'Communication' | 'Control Flow' | 'Data Operations' | 'Integrations' | 'System Utilities';

    argsSchema?: Record<string, {
        type: ArgSchemaType;
        required: boolean;
        default?: any;
    }>;

    // 🛠️ Runtime configuration (for agents, flow assignment, cooldowns, etc)
    config?: {
        default_flow_id?: string;
        assigned_flow_ids?: string[];
        cooldown_seconds?: number;
        behavior?: string;
        context_mode?: string;
        created_by?: string;
    };

    // 🎛️ Flow execution logic
    args?: Record<string, any>;             // Runtime arguments passed to handler
    condition?: string;                     // Optional guard clause
    forEach?: string;                       // Loop path in context
    steps?: AgentFlowNode[];               // For nested chains / substeps

    // 🧠 Context-injection (used when preloading values from engine)
    memory?: Record<string, any>;

    // 🎨 ReactFlow compatibility
    position?: { x: number; y: number };   // Canvas layout
    style?: React.CSSProperties;           // Optional styling
    data?: Record<string, any>;            // Generic UI data payload
}

const sendEmailNode: AgentFlowNode = {
    id: 'send-email',
    label: 'Send Email',
    run: 'sendEmailHandler',
    type: 'function',
    category: 'Communication',
    description: 'Send an email to a specified address.',
    args: {
        to: '{{user.email}}',
        subject: 'Task Notification',
        body: 'You have a new task assigned.',
    },
    argsSchema: {
        to: { type: 'string', required: true },
        subject: { type: 'string', required: true },
        body: { type: 'string', required: true },
    },
    position: { x: 100, y: 100 },
};
const waitNode: AgentFlowNode = {
    id: 'wait-1',
    label: 'Wait',
    run: 'waitMsHandler',
    type: 'function',
    category: 'Control Flow',
    description: 'Pause flow execution for a given number of milliseconds.',
    args: {
        ms: 1000,
    },
    argsSchema: {
        ms: { type: 'number', required: true },
    },
    position: { x: 300, y: 100 },
};
const openaiNode: AgentFlowNode = {
    id: 'openai-completion',
    label: 'OpenAI Completion',
    run: 'openaiCompletionHandler',
    type: 'integration',
    category: 'Integrations',
    description: 'Generate a text completion using OpenAI.',
    args: {
        prompt: 'Summarize the following task: {{task.description}}',
        model: 'gpt-4o',
        temperature: 0.7,
    },
    argsSchema: {
        prompt: { type: 'string', required: true },
        model: { type: 'string', required: false, default: 'gpt-4o' },
        temperature: { type: 'number', required: false, default: 0.7 },
    },
    position: { x: 500, y: 100 },
};
const logNode: AgentFlowNode = {
    id: 'log-context',
    label: 'Log Context',
    run: 'logMessageHandler',
    type: 'log',
    category: 'System Utilities',
    description: 'Log a message for debugging.',
    args: {
        message: 'Context keys: {{JSON.stringify(context)}}',
    },
    argsSchema: {
        message: { type: 'string', required: true },
    },
    position: { x: 700, y: 100 },
};

const fetchJsonNode: AgentFlowNode = {
    id: 'fetch-json',
    label: 'Fetch JSON from URL',
    run: 'fetchJsonHandler',
    type: 'function',
    category: 'Data Operations',
    description: 'Fetch a JSON payload from a remote endpoint.',
    args: {
        url: 'https://api.example.com/data',
        method: 'GET',
        headers: {},
    },
    argsSchema: {
        url: { type: 'string', required: true },
        method: { type: 'string', required: false, default: 'GET' },
        headers: { type: 'object', required: false },
    },
    position: { x: 700, y: 100 },
};
const n8nExecuteNode: AgentFlowNode = {
    id: 'n8n-execute',
    label: 'Trigger n8n Workflow',
    run: 'triggerN8nWorkflow',
    type: 'integration',
    category: 'Integrations',
    description: 'Trigger an n8n webhook or named workflow by ID.',
    args: {
        webhookUrl: 'https://n8n.example.com/webhook/my-webhook',
        payload: '{{context}}',
    },
    argsSchema: {
        webhookUrl: { type: 'string', required: true },
        payload: { type: 'any', required: false },
    },
    position: { x: 100, y: 200 },
};
const memoryLogNode: AgentFlowNode = {
    id: 'log-memory',
    label: 'Log Agent Memory',
    run: 'logAgentMemory',
    type: 'memory',
    category: 'System Utilities',
    description: 'Store a memory vector into Qdrant.',
    args: {
        content: '{{context.task.description}}',
        type: 'task',
        tags: ['auto', 'planner'],
    },
    argsSchema: {
        content: { type: 'string', required: true },
        type: { type: 'string', required: false, default: 'memory' },
        tags: { type: 'array', required: false },
    },
    position: { x: 300, y: 200 },
};
const wordpressPostNode: AgentFlowNode = {
    id: 'publish-wordpress',
    label: 'Publish Blog Post',
    run: 'publishWordpressPost',
    type: 'integration',
    category: 'Integrations',
    description: 'Create a new blog post on your WordPress site.',
    args: {
        title: '{{context.title}}',
        content: '{{context.body}}',
        status: 'publish',
    },
    argsSchema: {
        title: { type: 'string', required: true },
        content: { type: 'string', required: true },
        status: { type: 'string', required: false, default: 'draft' },
    },
    position: { x: 500, y: 200 },
};
const notionAppendNode: AgentFlowNode = {
    id: 'notion-append',
    label: 'Add Row to Notion DB',
    run: 'appendNotionTask',
    type: 'integration',
    category: 'Integrations',
    description: 'Add a new task or row to a Notion database.',
    args: {
        databaseId: 'YOUR_NOTION_DATABASE_ID',
        title: '{{context.task.title}}',
        status: 'In Progress',
        priority: '{{context.task.priority}}',
    },
    argsSchema: {
        databaseId: { type: 'string', required: true },
        title: { type: 'string', required: true },
        status: { type: 'string', required: false },
        priority: { type: 'string', required: false },
    },
    position: { x: 700, y: 200 },
};
export const supabaseOperationNode = {
    id: 'supabase-operation',
    label: 'Supabase Operation',
    description: 'Perform CRUD operations on a Supabase table.',
    category: 'Integrations',
    type: 'function',
    argsSchema: {
        action: {
            type: 'string',
            required: true,
            default: 'select',
            enum: ['select', 'insert', 'update', 'delete']
        },
        table: { type: 'string', required: true },
        payload: { type: 'object', required: false }, // for insert/update
        filters: { type: 'object', required: false }, // for select/update/delete
        single: { type: 'boolean', required: false, default: false }
    },
    run: 'supabaseOperationHandler',
};

const logMessageNode: AgentFlowNode = {
    id: 'log-message',
    label: 'Log Message',
    run: 'logToClients',
    type: 'function',
    category: 'System Utilities',
    description: 'Log a message for debugging.',
    args: {
        message: '{{context.message}}',
    },
    argsSchema: {
        message: { type: 'string', required: true },
    },
    position: { x: 100, y: 200 },
};
// const waitNode: AgentFlowNode = {
//     id: 'wait',
//     label: 'Wait',
//     run: 'waitMsHandler',
//     type: 'control',
//     category: 'Control Flow',
//     description: 'Pause flow execution for a given number of milliseconds.',
//     args: {
//         ms: 0,
//     },
//     argsSchema: {
//         ms: { type: 'number', required: true },
//     },
//     position: { x: 100, y: 200 },
// };

export const nodeLibraryStarter: NodeLibraryItem[] = [
    // sendEmailNode,
    // fetchJsonNode,
    // n8nExecuteNode,
    // memoryLogNode,
    // wordpressPostNode,
    // notionAppendNode,
    // logNode,
    // memoryLogNode,
    // openaiNode,
    // waitNode,
    {
        id: 'send-email',
        label: 'Send Email',
        description: 'Send an email to a specified address.',
        category: 'Communication',
        argsSchema: {
            to: { type: 'string', required: true },
            subject: { type: 'string', required: true },
            body: { type: 'string', required: true },
        },
        handler: "sendEmailHandler",
    },
    {
        id: 'wait',
        label: 'Wait',
        description: 'Pause flow execution for a given number of milliseconds.',
        category: 'Control Flow',
        argsSchema: {
            ms: { type: 'number', required: true },
        },
        handler: "waitMsHandler",
    },
    {
        id: 'fetch-json',
        label: 'Fetch JSON from URL',
        description: 'Fetch a JSON payload from a remote endpoint.',
        category: 'Data Operations',
        argsSchema: {
            url: { type: 'string', required: true },
            method: { type: 'string', required: false, default: 'GET' },
            headers: { type: 'object', required: false },
        },
        handler: "fetchJsonHandler",
    },
    {
        id: 'openai-completion',
        label: 'OpenAI Completion',
        description: 'Generate a completion using an OpenAI model.',
        category: 'Integrations',
        argsSchema: {
            prompt: { type: 'string', required: true },
            model: { type: 'string', required: false, default: 'gpt-4o' },
            temperature: { type: 'number', required: false, default: 0.7 },
        },
        handler: "openaiCompletionHandler",
    },
    {
        id: 'log-message',
        label: 'Log Message',
        description: 'Log a message for debugging.',
        category: 'System Utilities',
        argsSchema: {
            message: { type: 'string', required: true },
        },
        run: "logMessageHandler",
        args: {
            message: '{{context.message}}',
        },
        position: { x: 100, y: 200 },
    },
];

export const nodeLibraryAdvanced: NodeLibraryItem[] = [
    ...nodeLibraryStarter,
    {
        id: 'send-email',
        label: 'Send Email',
        description: 'Send an email to a specified address.',
        category: 'Communication',
        argsSchema: {
            to: { type: 'string', required: true },
            subject: { type: 'string', required: true },
            body: { type: 'string', required: true },
        },
        handler: "sendEmailHandler",
    },
    {
        id: 'send-slack-message',
        label: 'Send Slack Message',
        description: 'Send a message to a Slack channel.',
        category: 'Communication',
        argsSchema: {
            channel: { type: 'string', required: true },
            message: { type: 'string', required: true },
        },
        handler: "sendSlackMessageHandler",
    },
    {
        id: 'wait',
        label: 'Wait',
        description: 'Pause flow execution for a given number of milliseconds.',
        category: 'Control Flow',
        argsSchema: {
            ms: { type: 'number', required: true },
        },
        handler: "waitMsHandler",
    },
    {
        id: 'if-condition',
        label: 'If Condition',
        description: 'Branch flow based on a condition.',
        category: 'Control Flow',
        argsSchema: {
            path: { type: 'string', required: true },
            expectedValue: { type: 'any', required: true },
        },
        handler: "ifConditionHandler",
    },
    {
        id: 'loop-over-array',
        label: 'Loop Over Array',
        description: 'Iterate over an array of items.',
        category: 'Control Flow',
        argsSchema: {
            arrayPath: { type: 'string', required: true },
        },
        handler: "loopOverArrayHandler",
    },
    {
        id: 'fetch-json',
        label: 'Fetch JSON from URL',
        description: 'Fetch a JSON payload from a remote endpoint.',
        category: 'Data Operations',
        argsSchema: {
            url: { type: 'string', required: true },
            method: { type: 'string', required: false, default: 'GET' },
            headers: { type: 'object', required: false },
        },
        handler: "fetchJsonHandler",
    },
    {
        id: 'post-json',
        label: 'Post JSON to URL',
        description: 'Send a JSON payload to a remote endpoint.',
        category: 'Data Operations',
        argsSchema: {
            url: { type: 'string', required: true },
            body: { type: 'object', required: true },
            headers: { type: 'object', required: false },
        },
        handler: "postJsonHandler",
    },
    {
        id: 'transform-text',
        label: 'Transform Text',
        description: 'Modify a text string (replace, split, etc).',
        category: 'Data Operations',
        argsSchema: {
            text: { type: 'string', required: true },
            operation: { type: 'string', required: true }, // could later enum: 'replace', 'split', 'join', etc
            pattern: { type: 'string', required: false },
            replacement: { type: 'string', required: false },
        },
        handler: "transformTextHandler",
    },
    {
        id: 'openai-completion',
        label: 'OpenAI Completion',
        description: 'Generate a text completion using OpenAI.',
        category: 'Integrations',
        argsSchema: {
            prompt: { type: 'string', required: true },
            model: { type: 'string', required: false, default: 'gpt-4o' },
            temperature: { type: 'number', required: false, default: 0.7 },
        },
        handler: "openaiCompletionHandler",
    },
    {
        id: 'ollama-completion',
        label: 'Ollama Local Completion',
        description: 'Generate a completion using local Ollama model.',
        category: 'Integrations',
        argsSchema: {
            prompt: { type: 'string', required: true },
            model: { type: 'string', required: false, default: 'llama3' },
            temperature: { type: 'number', required: false, default: 0.7 },
        },
        handler: "ollamaCompletionHandler",
    },
    {
        id: 'qdrant-search',
        label: 'Qdrant Vector Search',
        description: 'Perform a semantic vector search against a Qdrant collection.',
        category: 'Integrations',
        argsSchema: {
            query: { type: 'string', required: true },
            collection: { type: 'string', required: true },
            topK: { type: 'number', required: false, default: 5 },
        },
        handler: "qdrantSearchHandler",
    },
    {
        id: 'supabase-query',
        label: 'Supabase Query',
        description: 'Query a table in Supabase.',
        category: 'Integrations',
        argsSchema: {
            table: { type: 'string', required: true },
            filters: { type: 'object', required: false },
        },
        handler: "supabaseQueryHandler",
    },
    {
        id: 'supabase-insert',
        label: 'Supabase Insert',
        description: 'Insert a new record into a Supabase table.',
        category: 'Integrations',
        argsSchema: {
            table: { type: 'string', required: true },
            payload: { type: 'object', required: true },
        },
        handler: "supabaseInsertHandler",
    },
    {
        id: 'log-message',
        label: 'Log Message',
        description: 'Log a message for debugging.',
        category: 'System Utilities',
        argsSchema: {
            message: { type: 'string', required: true },
        },
        handler: "logMessageHandler",
    },
    {
        id: 'inject-context',
        label: 'Inject Value Into Context',
        description: 'Insert a static value into flow context for use later.',
        category: 'System Utilities',
        argsSchema: {
            key: { type: 'string', required: true },
            value: { type: 'any', required: true },
        },
        handler: "injectContextHandler",
    },
];

export const nodeLibrary: NodeLibraryItem[] = [
    logMessageNode,
    supabaseOperationNode,
];