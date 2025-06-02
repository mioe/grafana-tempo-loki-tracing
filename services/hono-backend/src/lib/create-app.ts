import type { Schema } from 'hono'

import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { requestId } from 'hono/request-id'
import { notFound, onError } from 'stoker/middlewares'
import { defaultHook } from 'stoker/openapi'

import env from '~/env'
import { csrfGuard } from '~/middlewares/csrf-guard'
import { pinoLogger } from '~/middlewares/pino-logger'

import type { AppBindings, AppOpenAPI } from './types'

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  })
}

export default function createApp() {
  const app = createRouter()

  app.use('*', cors({
    origin: env.NODE_ENV === 'development'
      ? env.CORS_ORIGINS
      : env.CORS_ORIGINS.filter(origin => !origin.includes('localhost')),
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'x-signature'],
    credentials: true,
  }))

  app
    .use(requestId())
    .use(pinoLogger())
    .use(csrfGuard())

  app.notFound(notFound)
  app.onError(onError)
  return app
}

export function createTestApp<S extends Schema>(router: AppOpenAPI<S>) {
  return createApp().route('/api', router)
}
