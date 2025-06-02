import { z } from '@hono/zod-openapi'
import { pgTable, uuid } from 'drizzle-orm/pg-core'

import { createdAt, id, name, SCHEMA_PATCH_DATE } from '../helpers'
import { rateTable } from './rate'

export const rateFeatureTable = pgTable('rate_feature', {
  id,
  name,
  rateId: uuid().notNull().references(() => rateTable.id),
  createdAt,
})

export const selectRateFeatureSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  rateId: z.string().uuid(),
  createdAt: SCHEMA_PATCH_DATE,
})
  .openapi('RateFeature')

export const insertRateFeatureSchema = z.object({
  name: z.string().min(1).max(255),
  rateId: z.string().uuid(),
})
  .openapi('CreateRateFeature')

export const patchRateFeatureSchema = insertRateFeatureSchema
  .partial()
  .openapi('UpdateRateFeature')
