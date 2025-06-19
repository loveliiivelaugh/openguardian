import { Hono } from 'hono';
import { generateTestFromPrompt } from '../codegen/generate';
import { runTestsOnFile } from '../codegen/run';
import { createPullRequest } from '../codegen/github';

const app = new Hono();
const port = 3535;

app.post('/api/codegen', async (c) => {
  const { filePath, task, testPath: customTestPath, coverageThreshold = 90 } = await c.req.json();

  const fs = await import('fs/promises');
  const path = await import('path');

  let content = '';
  let testPath = customTestPath || '';
  const isTDD = !filePath;

  if (!isTDD) {
    const exists = await fs.stat(filePath).catch(() => null);
    if (!exists) return c.json({ error: 'File not found' }, 404);

    content = await fs.readFile(filePath, 'utf8');
    if (!customTestPath) {
      testPath = filePath.replace(/\.([jt]sx?)$/, '.test.$1');
    }
  } else {
    content = ''; // no file yet
    if (!customTestPath) {
      return c.json({ error: 'In TDD mode, testPath is required' }, 400);
    }
    testPath = customTestPath;
  }

  let attempts = 0;
  let coverage = 0;
  let testOutput = '';
  let result = {};

  while (coverage < coverageThreshold && attempts < 3) {
    attempts++;
    testOutput = await generateTestFromPrompt(task, content);
    console.log(`Generated test output [attempt ${attempts}]:`, testOutput);

    try {
      await fs.writeFile(testPath, testOutput, 'utf8');
    } catch (error) {
      console.error('Error writing test file:', error);
      return c.json({ error: 'Failed to write test file', detail: error.message }, 500);
    }

    if (!isTDD) {
      result = await runTestsOnFile(testPath);
      console.log(`[Attempt ${attempts}] Test run result:`, result);
      coverage = result.coverage ?? 0;
    } else {
      // In TDD mode, just write the test and return
      break;
    }
  }

  return c.json({
    output: testOutput,
    coverage,
    testPath,
    attempts,
    ...(result || {}),
  });
});

app.post('/api/run-tests', async (c) => {
  const { path: testPath } = await c.req.json();
  const result = await runTestsOnFile(testPath);
  return c.json(result);
});

app.post('/api/pr', async (c) => {
  const { repo, branch, message } = await c.req.json();
  const pr = await createPullRequest(repo, branch, message);
  return c.json({ status: 'success', url: pr });
});

app.post('/api/codegen/impl', async (c) => {
  const { filePath, task = 'Implement this file' } = await c.req.json();

  const fs = await import('fs/promises');
  const exists = await fs.stat(filePath).catch(() => null);
  if (!exists) return c.json({ error: 'File not found' }, 404);

  const content = await fs.readFile(filePath, 'utf8');
  const implOutput = await generateTestFromPrompt(task, content); // same LLM runner, just different prompt

  return c.json({ output: implOutput });
});


// Start server
export default {
  port,
  fetch: app.fetch,
};
