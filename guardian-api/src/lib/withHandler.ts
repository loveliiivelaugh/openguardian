// @lib/withHandler.ts

import type { Context } from 'hono'
import { logSystemEvent } from './logSystemEvent'

type HandlerOptions = {
  logLevel?: 'info' | 'warn' | 'error' | 'debug' // override log level
  disableLog?: boolean
  hitlPending?: boolean
  successStatusCode?: number
  errorMessage?: string
}

export function withHandler(
  source: string,
  handler: (c: Context) => Promise<Response | any>,
  options: HandlerOptions = {}
) {
  return async (c: Context) => {
    const request = c.req.raw
    const request_id = crypto.randomUUID()
    const meta = {
      request_id,
      ip: c.req.header('x-forwarded-for') ?? 'unknown',
      ua: c.req.header('user-agent') ?? 'unknown',
      url: c.req.url,
      method: c.req.method
    }

    if (!options.disableLog) {
      await logSystemEvent({
        level: options.logLevel ?? 'info',
        source,
        message: `Incoming request: ${c.req.method} ${c.req.url}`,
        metadata: meta,
        request
      })
    }

    try {
      const result = await handler(c)

      if (!options.disableLog) {
        await logSystemEvent({
          level: options.logLevel ?? 'info',
          source,
          message: `Success: ${c.req.method} ${c.req.url}`,
          metadata: {
            ...meta,
            status: options.successStatusCode ?? 200
          },
          request
        })
      }

      if (options.hitlPending) {
        await logSystemEvent({
          level: 'info',
          source,
          message: `🧍 HITL review required`,
          metadata: { ...meta, type: 'hitl-pending' },
          request
        })
      }

      return result
    } catch (err: any) {
      console.error("🧨 Route error:", err)

      await logSystemEvent({
        level: 'error',
        source,
        message: `Error in ${c.req.method} ${c.req.url}`,
        metadata: {
          ...meta,
          error: err?.message || 'Unknown error',
          stack: err?.stack || null
        },
        request
      })

      return c.json(
        {
          error: options.errorMessage ?? 'Internal Server Error',
          request_id
        },
        500
      )
    }
  }
}
