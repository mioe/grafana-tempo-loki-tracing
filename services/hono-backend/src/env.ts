/* eslint-disable node/no-process-env */
import { config } from 'dotenv'
import { expand } from 'dotenv-expand'
import path from 'node:path'
import { z } from 'zod'

expand(config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
  ),
}))

const EnvSchema = z.object({
  // app/variables
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(4324),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),
  X_SIGNATURE: z.string().min(32, 'X-Signature must be at least 32 characters long'),
  ENABLE_SCALAR_API_DOCS: z.enum(['true', 'false']).default('false'),
  CORS_ORIGINS: z.string().default('http://localhost:4321,http://localhost:4323').transform(val => val.split(',')),

  // auth-service/variables
  AUTH_SERVICE_BACKEND_URL: z.string().default('http://localhost:4322'),
  ACCESS_COOKIE_NAME: z.enum(['accessToken', 'stageAccessToken']),
  REFRESH_COOKIE_NAME: z.enum(['refreshToken', 'stageRefreshToken']),
  SHARED_COOKIE_HOST: z.enum(['localhost', '.yourgood.app']),
  JWT_ACCESS_TOKEN_TTL: z.string().default('1h'),
  JWT_REFRESH_TOKEN_TTL: z.string().default('31d'),
  JWT_ACCESS_SALT: z.string().default('jwt-access-local-salt'),

  // postgresql/variables
  PG_HOST: z.string().default('localhost'),
  PG_PORT: z.coerce.number().default(54321),
  PG_DB: z.string().default('pg-db'),
  PG_USER: z.string().default('pg-user'),
  PG_PASSWORD: z.string().default('pg-pass'),
  DATABASE_URL: z.string().url(),
})

export type env = z.infer<typeof EnvSchema>

// eslint-disable-next-line ts/no-redeclare
const { data: env, error } = EnvSchema.safeParse(process.env)

if (error) {
  console.error('❌ Invalid env:')
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2))
  process.exit(1)
}

export default env!
