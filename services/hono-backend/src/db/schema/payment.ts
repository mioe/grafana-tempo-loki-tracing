import { z } from '@hono/zod-openapi'
import { boolean, pgTable, uuid } from 'drizzle-orm/pg-core'

import { cost, createdAt, id, SCHEMA_PATCH_DATE } from '../helpers'
import { currencyTable } from './currency'

export const paymentTable = pgTable('payment', {
  id,
  currencyId: uuid().notNull().references(() => currencyTable.id),
  finalCost: cost('final_cost'),
  finalDiscountCost: cost('final_discount_cost'),
  sysPayment: boolean().notNull(),
  createdAt,
})

export const selectPaymentSchema = z.object({
  id: z.string().uuid(),
  currencyId: z.string().uuid(),
  finalCost: z.number().positive(),
  finalDiscountCost: z.number().positive(),
  sysPayment: z.boolean(),
  createdAt: SCHEMA_PATCH_DATE,
})
  .openapi('Payment')

export const insertPaymentSchema = z.object({
  currencyId: z.string().uuid(),
  finalCost: z.number().positive(),
  finalDiscountCost: z.number().positive(),
  sysPayment: z.boolean(),
})
  .openapi('CreatePayment')

export const patchPaymentSchema = insertPaymentSchema
  .partial()
  .openapi('UpdatePayment')
