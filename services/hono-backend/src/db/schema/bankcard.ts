import { z } from '@hono/zod-openapi'
import { json, pgTable, uuid } from 'drizzle-orm/pg-core'

import { companyId, createdAt, id, SCHEMA_PATCH_DATE } from '../helpers'
import { bankAcquiringTable } from './bank-acquiring'
import { currencyTable } from './currency'

export interface PublicCartInfoType {
  first6: string
  last4: string
  expiry_month: string
  expiry_year: string
  card_type: string
  card_product: {
    code: string
    name: string
  }
  issuer_country: string
  issuer_name: string
}

export const bankcardTable = pgTable('bankcard', {
  id,
  companyId,
  bankAcquiringId: uuid().notNull().references(() => bankAcquiringTable.id),
  currencyId: uuid().notNull().references(() => currencyTable.id),
  paymentToken: uuid(),
  publicCartInfo: json().$type<PublicCartInfoType>(),
  createdAt,
})

const publicCartInfoSchema = z.object({
  first6: z.string(),
  last4: z.string(),
  expiry_month: z.string(),
  expiry_year: z.string(),
  card_type: z.string(),
  card_product: z.object({
    code: z.string(),
    name: z.string(),
  }),
  issuer_country: z.string(),
  issuer_name: z.string(),
})

export const selectBankcardSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  bankAcquiringId: z.string().uuid(),
  currencyId: z.string().uuid(),
  paymentToken: z.string().uuid().nullable(),
  publicCartInfo: publicCartInfoSchema.nullable(),
  createdAt: SCHEMA_PATCH_DATE,
})
  .openapi('Bankcard')

export const insertBankcardSchema = z.object({
  bankAcquiringId: z.string().uuid(),
  currencyId: z.string().uuid(),
  paymentToken: z.string().uuid().optional().nullable(),
  publicCartInfo: publicCartInfoSchema.optional().nullable(),
})
  .openapi('CreateBankcard')

export const patchBankcardSchema = insertBankcardSchema
  .partial()
  .openapi('UpdateBankcard')
