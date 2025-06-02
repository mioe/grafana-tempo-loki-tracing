import { z } from '@hono/zod-openapi'
import { decimal, pgTable, uuid } from 'drizzle-orm/pg-core'

import { createdAt, DECIMAL_PRECISION, DECIMAL_SCALE, id, SCHEMA_PATCH_DATE } from '../helpers'
import { currencyTable } from './currency'
import { rateFeatureTable } from './rate-feature'

export const rateFeatureCostTable = pgTable('rate_feature_cost', {
  id,
  currencyId: uuid().notNull().references(() => currencyTable.id),
  rateFeatureId: uuid().notNull().references(() => rateFeatureTable.id),
  costPerPiece: decimal({ precision: DECIMAL_PRECISION, scale: DECIMAL_SCALE }),
  createdAt,
})

export const selectRateFeatureCostSchema = z.object({
  id: z.string().uuid(),
  currencyId: z.string().uuid(),
  rateFeatureId: z.string().uuid(),
  costPerPiece: z.number().positive().nullable(),
  createdAt: SCHEMA_PATCH_DATE,
})
  .openapi('RateFeatureCost')

export const insertRateFeatureCostSchema = z.object({
  currencyId: z.string().uuid(),
  rateFeatureId: z.string().uuid(),
  costPerPiece: z.number().positive().optional().nullable(),
})
  .openapi('CreateRateFeatureCost')

export const patchRateFeatureCostSchema = insertRateFeatureCostSchema
  .partial()
  .openapi('UpdateRateFeatureCost')
