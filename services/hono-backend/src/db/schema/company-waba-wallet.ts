import { z } from '@hono/zod-openapi'
import { boolean, pgTable, uuid } from 'drizzle-orm/pg-core'

import { companyId, cost, createdAt, id, SCHEMA_PATCH_DATE } from '../helpers'
import { currencyTable } from './currency'

export const companyWabaWalletTable = pgTable('company_waba_wallet', {
  id,
  companyId,
  value: cost('value'),
  currencyId: uuid().notNull().references(() => currencyTable.id),
  minLimit: cost('min_limit'),
  autopayment: boolean().notNull(),
  createdAt,
})

export const selectCompanyWabaWalletSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  value: z.number().positive(),
  currencyId: z.string().uuid(),
  minLimit: z.number().positive(),
  autopayment: z.boolean(),
  createdAt: SCHEMA_PATCH_DATE,
})
  .openapi('CompanyWabaWallet')

export const insertCompanyWabaWalletSchema = z.object({
  companyId: z.string().uuid(),
  value: z.number().positive(),
  currencyId: z.string().uuid(),
  minLimit: z.number().positive(),
  autopayment: z.boolean(),
})
  .openapi('CreateCompanyWabaWallet')

export const patchCompanyWabaWalletSchema = insertCompanyWabaWalletSchema
  .partial()
  .openapi('UpdateCompanyWabaWallet')
