import type { Context } from 'hono';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { withHandler } from '@lib/withHandler'
import { runLLM } from '@lib/runLLM';

const port = Bun.env.PORT || 9876;
const app = new OpenAPIHono()

app.get('/', (c: Context) => {
  return c.text('Hello Hono!')
})

const guardianRoutes = new OpenAPIHono();

guardianRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/llm/generate',
    summary: 'Generate code using LLM',
    description: 'This route is dedicated for the CLI tool. Its purpose is to assist in the automation of in context code generation',
    tags: ['Codegen'],
    responses: {
      200: {
        description: 'Code generation result',
        content: {
          'application/json': {
            schema: z.object({
              message: z.string(),
              files: z.array(z.string())
            })
          }
        }
      }
    }
  }),
  withHandler('guardian.generate', async (c: Context) => {
    const { prompt, model } = await c.req.json();
    const result = await runLLM({ prompt, model: model || "gemini" });

    console.log("Result: ", result)
    const message = result;
    const files: any[] = [];
    console.log('🤖 Generated files:', message, files);
    return c.json({ message, files });
  })
);

app.route('/api/v1/guardian', guardianRoutes)

export default { app, port };
