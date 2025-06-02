import { z } from '@hono/zod-openapi'
import { pgTable, varchar } from 'drizzle-orm/pg-core'

import { companyId, createdAt, id, name, SCHEMA_PATCH_DATE } from '../helpers'

export const companyInnTable = pgTable('company_inn', {
  id,
  companyId,
  inn: varchar({ length: 255 }).notNull(),
  kpp: varchar({ length: 255 }).notNull(),
  name,
  address: varchar({ length: 255 }).notNull(),
  createdAt,
})

export const selectCompanyInnSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  inn: z.string().min(1).max(255),
  kpp: z.string().min(1).max(255),
  name: z.string().min(1).max(255),
  address: z.string().min(1).max(255),
  createdAt: SCHEMA_PATCH_DATE,
})
  .openapi('CompanyInn')

export const insertCompanyInnSchema = z.object({
  companyId: z.string().uuid(),
  inn: z.string().min(1).max(255),
  kpp: z.string().min(1).max(255),
  name: z.string().min(1).max(255),
  address: z.string().min(1).max(255),
})
  .openapi('CreateCompanyInn')

export const patchCompanyInnSchema = insertCompanyInnSchema
  .partial()
  .openapi('UpdateCompanyInn')
