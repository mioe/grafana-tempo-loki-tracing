import { z } from '@hono/zod-openapi'
import { pgTable, uuid } from 'drizzle-orm/pg-core'

import { cost, createdAt, id, SCHEMA_PATCH_DATE } from '../helpers'
import { currencyTable } from './currency'
import { rateTable } from './rate'

export const rateCostTable = pgTable('rate_cost', {
  id,
  currencyId: uuid().notNull().references(() => currencyTable.id),
  rateId: uuid().notNull().references(() => rateTable.id),
  cost: cost(),
  createdAt,
})

export const selectRateCostSchema = z.object({
  id: z.string().uuid(),
  currencyId: z.string().uuid(),
  rateId: z.string().uuid(),
  cost: z.number().positive(),
  createdAt: SCHEMA_PATCH_DATE,
})
  .openapi('RateCost')

export const insertRateCostSchema = z.object({
  currencyId: z.string().uuid(),
  rateId: z.string().uuid(),
  cost: z.number().positive(),
})
  .openapi('CreateRateCost')

export const patchRateCostSchema = insertRateCostSchema
  .partial()
  .openapi('UpdateRateCost')
