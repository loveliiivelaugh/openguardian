import axios from 'axios';
import ollama from 'ollama';
const guardianClient = axios.create({
  baseURL: 'http://localhost:9876',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})
function detectFileType(filePath: string): 'component' | 'utility' | 'api' | 'config' | 'unknown' {
  if (filePath.includes('/components/') || filePath.endsWith('.tsx')) return 'component';
  if (filePath.includes('/utils/') || filePath.includes('/helpers/')) return 'utility';
  if (filePath.includes('/api/') || filePath.includes('/routes/')) return 'api';
  if (filePath.includes('.config') || filePath.includes('/config/')) return 'config';
  return 'unknown';
}
function buildPrompt(fileType: string, fileContent: string, task: string) {
  const baseContext = `
Use only ESM imports. No CommonJS (require).
Assume the code runs in a jsdom environment unless otherwise specified.
Do not use Node-specific or streaming APIs unless the original code uses them.
`;

  const frontendContext = `
Use the following libraries for testing:
- Vitest (test runner)
- @testing-library/react (for rendering and assertions)

Write simple unit tests using "render()" and "screen".
Avoid SSR-related functions like renderToReadableStream.
Avoid global mocks unless absolutely necessary.
`;

  const backendContext = `
Use Vitest as the test runner.
Use MSW or appropriate mocking tools to simulate APIs or services.
Only use Node.js APIs if they were used in the original file.
`;

  const apiContext = `
Use Vitest and MSW to mock fetch/request logic.
Assume asynchronous data fetching when applicable.
Focus on endpoint behavior, input/output, and side effects.
`;

  const taskPrompt = fileContent
    ? `Write unit tests for the following file:\n\n${fileContent}\n\n${task}`
    : `Write a unit test file based on this description:\n\n${task}`;

  switch (fileType) {
    case 'component':
      return `${taskPrompt}\n\n${frontendContext}${baseContext}`;
    case 'utility':
    case 'config':
      return `${taskPrompt}\n\n${backendContext}${baseContext}`;
    case 'api':
      return `${taskPrompt}\n\n${apiContext}${baseContext}`;
    default:
      return `${taskPrompt}\n\n${baseContext}`;
  }
}
export async function generateTestFromPrompt(prompt: string, fileContent: string, filePath?: string) {
  console.log("GenerateTestFromPrompt: [Prompt]: ", prompt, filePath);

  const fileType = filePath ? detectFileType(filePath) : 'unknown';
  const dynamicPrompt = buildPrompt(fileType, fileContent, prompt);

  const response = (await guardianClient.post('/api/v1/guardian/llm/generate', {
    prompt: dynamicPrompt,
    model: 'dolphin3:8b',
  })).data;
  const text = response.output;

  // const response = await ollama.chat({
  //   model: 'dolphin3:8b',
  //   messages: [{ role: 'user', content: dynamicPrompt }],
  // });

  // const text = response.message.content;
  console.log("GenerateTestFromPrompt: [Response]: ", text);

  return text;

  if (
    /renderToReadableStream|ReadableStream|require\(/.test(text) ||
    text.includes('@testing-library/react-dom')
  ) {
    throw new Error("LLM generated test with disallowed API or bad import.");
  }

  return text;
}

export async function generateTestFromPromptV0(prompt: string, fileContent: string) {
    // Example Ollama call via CLI (you can also call API directly if local LLM server running)
    console.log("GenerateTestFromPrompt: [Prompt]: ", prompt, fileContent);

    const frameworkContext = `
Use these libraries ONLY:
- Vitest
- @testing-library/react

Do NOT use renderToReadableStream or attempt SSR streams.
Assume all tests run in jsdom environment (no actual DOM or streams).

Only write simple component tests using "render()" and "screen".
Import from "@testing-library/react" only.
`;

    const frameworkContext2 = `Use the following test libraries: 
- Vitest (unit test runner)
- React Testing Library (DOM testing)
- MSW (mock service worker for API mocks if needed)

Use ESM imports. No require().`;
    const fixedPrompt = `Write unit tests for the following file:\n\n${fileContent}\n\n${prompt}\n\n${frameworkContext}`;
    // const response = await fetch("http://localhost:3456/proxy/chat", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       model: "dolphin3:8b",
    //       messages: [{ role: "user", content: fixedPrompt }],
    //     //   ...(normalizedOptions.format && { format: normalizedOptions.format })
    //     }),
    // });
    // const data: any = await response.json();
    const response = await ollama.chat({
        model: 'dolphin3:8b',
        messages: [{ role: 'user', content: fixedPrompt }],
        // ...options?.json && {
        //     format: options.json
        // }
    })
    const text = response.message.content;
    console.log("GenerateTestFromPrompt: [Response]: ", text);
    return text;
    // return { model: 'dolphin3:8b', prompt, text, output: text }
    // return data?.message?.content;
}
