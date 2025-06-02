import { z } from '@hono/zod-openapi'
import { pgTable, uuid } from 'drizzle-orm/pg-core'

import { createdAt, id, SCHEMA_PATCH_DATE, updatedAt } from '../helpers'
import { companyRateTable } from './company-rate'
import { rateFeatureTable } from './rate-feature'

export const companyRateFeatureTable = pgTable('company_rate_feature', {
  id,
  companyRateId: uuid().notNull().references(() => companyRateTable.id),
  rateFeatureId: uuid().notNull().references(() => rateFeatureTable.id),
  userId: uuid(),
  createdAt,
  updatedAt,
})

export const selectCompanyRateFeatureSchema = z.object({
  id: z.string().uuid(),
  companyRateId: z.string().uuid(),
  rateFeatureId: z.string().uuid(),
  userId: z.string().uuid().nullable(),
  createdAt: SCHEMA_PATCH_DATE,
  updatedAt: SCHEMA_PATCH_DATE.nullable(),
})
  .openapi('CompanyRateFeature')

export const insertCompanyRateFeatureSchema = z.object({
  companyRateId: z.string().uuid(),
  rateFeatureId: z.string().uuid(),
  userId: z.string().uuid().optional().nullable(),
})
  .openapi('CreateCompanyRateFeature')

export const patchCompanyRateFeatureSchema = insertCompanyRateFeatureSchema
  .partial()
  .openapi('UpdateCompanyRateFeature')
