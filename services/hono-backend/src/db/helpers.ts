import { z } from '@hono/zod-openapi'
import { sql } from 'drizzle-orm'
import { decimal, integer, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const DECIMAL_PRECISION = 19
export const DECIMAL_SCALE = 4

export const id = uuid().primaryKey().notNull().default(sql`gen_random_uuid()`)
export const companyId = uuid().notNull()
export const name = varchar({ length: 255 }).notNull()
export const description = text()
export const createdAt = timestamp().notNull().defaultNow()
export const updatedAt = timestamp().notNull().defaultNow()
export const qtyMonths = integer().notNull()
export const expAt = timestamp().notNull()

export const cost = (name = 'cost') => decimal(name, { precision: DECIMAL_PRECISION, scale: DECIMAL_SCALE }).notNull()

export const SCHEMA_PATCH_DATE = z.string().datetime().openapi({
  type: 'string',
  format: 'date-time',
  example: '2025-05-29T12:06:02.807Z',
})
