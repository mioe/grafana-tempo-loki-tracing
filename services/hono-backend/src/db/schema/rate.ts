import { z } from '@hono/zod-openapi'
import { boolean, pgTable, uuid } from 'drizzle-orm/pg-core'

import { createdAt, id, name, SCHEMA_PATCH_DATE } from '../helpers'

export const rateTable = pgTable('rate', {
  id,
  name,
  productId: uuid().notNull(),
  hidden: boolean().notNull(),
  createdAt,
})

const zProductId = z.string().uuid().openapi({
  description: 'id provider/product in auth-service',
})

export const selectRateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  productId: zProductId,
  hidden: z.boolean(),
  createdAt: SCHEMA_PATCH_DATE,
})
  .openapi('Rate')

export const insertRateSchema = z.object({
  name: z.string().min(1).max(255),
  productId: zProductId,
  hidden: z.boolean(),
})
  .openapi('CreateRate')

export const patchRateSchema = insertRateSchema
  .partial()
  .openapi('UpdateRate')
