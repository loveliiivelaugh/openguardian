import type { Context } from 'hono';
import { cors } from 'hono/cors';
import { poweredBy } from 'hono/powered-by';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { withHandler } from '@lib/withHandler'
import { runLLM } from '@lib/runLLM';
import { supabase } from '@config/supabase.config';
import { swaggerUI } from '@hono/swagger-ui';
import { addMemory } from './lib/addMemory';
import { retrieveMemory } from './lib/retrieveMemory';

const port = Bun.env.PORT || 9099;
const app = new OpenAPIHono()

// Middleware
app
  .use(poweredBy())
  .use(logger())
  .use(cors({ origin: "*" }))
  .use(prettyJSON({ space: 4 }))

app.get('/', (c: Context) => {
  return c.text('Hello Hono!')
})

app.get('/ui', swaggerUI({ url: '/doc' }));
app.doc('/doc', {
  openapi: '3.1.0',
  info: {
    title: 'Guardian API Open Source',
    version: 'v1',
    description: "Guardian API Open Source"
  },
  servers: [
    {
      url: `http://localhost:${port}`,
      description: 'Guardian API Open Source',
    }
  ],
  tags: []
});

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

const databaseRoutes = new OpenAPIHono();
databaseRoutes
  .openapi(
    createRoute({
      method: 'get',
      path: '/read_db/:table',
      summary: 'Read Supabase Table Contents with Pagination',
      tags: ['Supabase'],
      parameters: [
        { name: 'table', in: 'path' },
        { name: 'limit', in: 'query', required: false },
        { name: 'offset', in: 'query', required: false }
      ],
      query: {
        limit: z.number().optional().default(100),
        offset: z.number().optional().default(0),
        user_id: z.string().optional()
      },
      responses: {
        200: {
          description: 'Paginated table results',
          content: {
            'application/json': {
              schema: z.object({})
            }
          }
        }
      }
    }),
    withHandler('database.read_db', async (c: Context) => {
      const table = c.req.param('table');
      const query = c.req.query();

      const limit = parseInt(query.limit ?? '100', 10);
      const offset = parseInt(query.offset ?? '0', 10);

      const { data, error } = await supabase
        .from(table)
        .select('*')
        .range(offset, offset + limit - 1); // Supabase range is inclusive

      if (error) {
        return c.json({ error: error.message }, 500);
      }

      return c.json({
        data,
        pagination: {
          limit,
          offset,
          nextOffset: offset + limit
        }
      });
    })
  )

  guardianRoutes.openapi(
    createRoute({
      method: 'post',
      path: '/addMemory',
      summary: 'Add memory to the system',
      description: '',
      tags: ['guardian', 'Memory'],
      responses: {
        200: {
          description: 'Memory added successfully',
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
    withHandler('guardian.addMemory', async (c) => {
      const payload: any = await c.req.json();
      const result = await addMemory(payload);
      return c.json({ message: "Memory added successfully", result });
    })
  );

guardianRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/retrieve-memories',
    summary: 'Retrieve memories using semantic search',
    tags: ['Memory'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              query: z.string().describe('Search query text'),
              userId: z.string().describe('User ID'),
              topK: z.number().optional().default(5),
              tags: z.array(z.string()).optional().default([]),
              // enrich: z.boolean().optional().default(false)
            })
          }
        },
        required: true
      }
    },
    responses: {
      200: {
        description: 'Retrieved memory results',
        content: {
          'application/json': {
            schema: z.object({
              results: z.array(z.any())
            })
          }
        }
      }
    }
  }),
  withHandler('retrieve-memories', async (c: Context) => {
    const body = await c.req.json();

    const result = await retrieveMemory({
      query: body.query,
      // userId: body.userId,
      // enrich: body.enrich,
      // type: body.type,
      topK: body.topK,
      tags: body.tags
    });

    if (!result) {
      return c.json({ error: 'No memory found' }, 404);
    }

    return c.json({ results: result });
  })
);

const schema = z.object({
  user_id: z.string(),
  service: z.enum(["notion", "github", "email", "slack", "openai"]),
  encrypted_token: z.string(),
  iv: z.string(),
  auth_tag: z.string()
});

export const saveIntegrationRoute = createRoute({
  method: "post",
  path: "/create-integration",
  summary: "Save encrypted integration credentials",
  tags: ["Integrations"],
  //   request: {
  //     body: {
  //       content: {
  //         "application/json": {
  //           schema
  //         }
  //       }
  //     }
  //   },
  responses: {
    200: {
      description: "Integration saved",
      content: {
        "application/json": {
          schema: z.object({
            status: z.literal("success"),
            integration_id: z.string()
          })
        }
      }
    }
  }
});

export const saveIntegrationHandler = withHandler("aegis.create-integration", async (c: Context) => {
  console.log("saveIntegrationHandler: WERRE IN HERE!")
  const body = await c.req.json();
  console.log("body: ", body)
  const { user_id, service, encrypted_token, iv, auth_tag } = schema.parse(body);

  const { data, error } = await supabase.from("user_integrations").insert({
    user_id,
    service,
    encrypted_token,
    iv,
    auth_tag
  }).select().single();

  if (error) {
    console.error("❌ Error inserting integration:", error);
    return c.json({ status: "error", error: error.message }, 500);
  }

  return c.json({ status: "success", integration_id: data.id });
});

guardianRoutes.openapi(saveIntegrationRoute, saveIntegrationHandler);


app.route('/api/v1/guardian', guardianRoutes)
app.route('/database', databaseRoutes)

export default { fetch: app.fetch, port };
