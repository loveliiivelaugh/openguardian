import { gemini2_5 } from '@config/clients';
import { addMemory, retrieveMemory, MemoryInput } from '@lib/memory';

const MODEL_THROTTLE_MS = {
    gemini: 3000,
    gpt4o: 2000,
    ollama: 0,
};

let lastCall = 0;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const modelFetch = async ({
    model,
    prompt,
    format,
}: {
    model: string;
    prompt: string;
    format?: any;
}) => {
    const res = await fetch('http://localhost:3456/proxy/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            ...(format && { format }),
        }),
    });
    const data = await res.json();
    return data?.message?.content;
};

export async function runLLM({
    prompt,
    model = 'ollama',
    format,
    memoryContext,
    save = true,
    tags = [],
}: {
    prompt: string;
    model?: 'gemini' | 'gpt4o' | 'ollama' | string;
    format?: any; // JSON Schema or structured flag
    memoryContext?: {
        agent: string;
        flowId?: string;
        runId?: string;
    };
    save?: boolean;
    tags?: string[];
}) {
    const now = Date.now();
    const wait = MODEL_THROTTLE_MS[model as keyof typeof MODEL_THROTTLE_MS] ?? 3000;
    const timeSince = now - lastCall;

    if (timeSince < wait) await delay(wait - timeSince);
    lastCall = Date.now();

    let output = '';

    if (model === 'gemini') {
        const res = await gemini2_5.models.generateContent({
            model: 'gemini-2.0-flash-001',
            contents: prompt,
            ...(format && {
                responseMiMeType: 'application/json',
                responseSchema: format,
            }),
        });
        output = res.text as string;
    } else if (model === 'gpt4o') {
        output = '[GPT-4o not available in OSS]';
    } else {
        output = await modelFetch({ model, prompt, format });
    }

    if (save && memoryContext) {
        await addMemory({
            id: crypto.randomUUID(),
            source: 'manual',
            source_id: crypto.randomUUID(),
            summary: prompt.slice(0, 60),
            agent: memoryContext.agent,
            flowId: memoryContext.flowId,
            runId: memoryContext.runId,
            title: prompt.slice(0, 60),
            content: output,
            type: 'llm_interaction',
            tags: ['llm', model, ...tags],
            created_at: new Date().toISOString(),
        } as MemoryInput);
    }

    return { model, output, prompt };
}

export async function runLLMWithMemory({
    prompt,
    model = 'ollama',
    agent = 'guardian',
    tags = [],
    topK = 5,
    flowId,
    runId,
}: {
    prompt: string;
    model?: string;
    agent?: string;
    tags?: string[];
    topK?: number;
    flowId?: string;
    runId?: string;
}) {
    const { results } = await retrieveMemory({ query: prompt, agent, topK, tags });

    const memoryContext = results
        .map((m: any) => `• (${m.type}) [${new Date(m.created_at).toLocaleDateString()}]: ${m.content}`)
        .join('\n');

    const contextPrompt = `
  You are Guardian, an AI agent reflecting on memory to respond thoughtfully.
  
  Context:
  ${memoryContext}
  
  Now respond to:
  "${prompt}"
  `.trim();

    return runLLM({
        prompt: contextPrompt,
        model,
        memoryContext: { agent, flowId, runId },
        tags,
    });
}
