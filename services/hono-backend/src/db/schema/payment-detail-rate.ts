import { z } from '@hono/zod-openapi'
import { pgTable, uuid } from 'drizzle-orm/pg-core'

import { cost, qtyMonths } from '../helpers'
import { companyRateTable } from './company-rate'
import { currencyTable } from './currency'
import { paymentTable } from './payment'

export const paymentDetailRateTable = pgTable('payment_detail_rate', {
  paymentId: uuid().notNull().references(() => paymentTable.id),
  companyRateId: uuid().notNull().references(() => companyRateTable.id),
  currencyId: uuid().notNull().references(() => currencyTable.id),
  qtyMonths,
  cost: cost(),
  discountCost: cost('discount_cost'),
})

export const selectPaymentDetailRateSchema = z.object({
  paymentId: z.string().uuid(),
  companyRateId: z.string().uuid(),
  currencyId: z.string().uuid(),
  qtyMonths: z.number().int().positive(),
  cost: z.number().positive(),
  discountCost: z.number().positive(),
})
  .openapi('PaymentDetailRate')

export const insertPaymentDetailRateSchema = z.object({
  paymentId: z.string().uuid(),
  companyRateId: z.string().uuid(),
  currencyId: z.string().uuid(),
  qtyMonths: z.number().int().positive(),
  cost: z.number().positive(),
  discountCost: z.number().positive(),
})
  .openapi('CreatePaymentDetailRate')

export const patchPaymentDetailRateSchema = insertPaymentDetailRateSchema
  .partial()
  .openapi('UpdatePaymentDetailRate')
