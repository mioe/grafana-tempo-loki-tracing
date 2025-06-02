import { z } from '@hono/zod-openapi'
import { boolean, pgTable, timestamp, unique, uuid } from 'drizzle-orm/pg-core'

import { companyId, createdAt, expAt, id, qtyMonths, SCHEMA_PATCH_DATE } from '../helpers'
import { rateTable } from './rate'

export const companyRateTable = pgTable('company_rate', {
  id,
  companyId,
  rateId: uuid().notNull().references(() => rateTable.id),
  nextRateId: uuid(),
  expAt,
  qtyMonths,
  autopayment: boolean().notNull(),
  changedAt: timestamp().defaultNow(),
  createdAt,
}, t => [
  unique('uq_company_rate_company_id_rate_id')
    .on(t.companyId, t.rateId),
])

export const selectCompanyRateSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  rateId: z.string().uuid(),
  nextRateId: z.string().uuid().nullable(),
  expAt: SCHEMA_PATCH_DATE.nullable(),
  qtyMonths: z.number().int().positive().nullable(),
  autopayment: z.boolean(),
  changedAt: SCHEMA_PATCH_DATE.nullable(),
  createdAt: SCHEMA_PATCH_DATE,
})
  .openapi('CompanyRate')

export const insertCompanyRateSchema = z.object({
  rateId: z.string().uuid(),
  nextRateId: z.string().uuid().optional().nullable(),
  expAt: SCHEMA_PATCH_DATE.optional().nullable(),
  qtyMonths: z.number().int().positive().optional().nullable(),
  autopayment: z.boolean(),
})
  .openapi('CreateCompanyRate')

export const patchCompanyRateSchema = insertCompanyRateSchema
  .partial()
  .openapi('UpdateCompanyRate')
