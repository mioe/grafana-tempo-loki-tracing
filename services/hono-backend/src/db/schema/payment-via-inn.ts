import { z } from '@hono/zod-openapi'
import { pgTable, uuid } from 'drizzle-orm/pg-core'

import { companyInnTable } from './company-inn'
import { paymentTable } from './payment'

export const paymentViaInnTable = pgTable('payment_via_inn', {
  companyInnId: uuid().notNull().references(() => companyInnTable.id),
  paymentId: uuid().notNull().references(() => paymentTable.id),
})

export const selectPaymentViaInnSchema = z.object({
  companyInnId: z.string().uuid(),
  paymentId: z.string().uuid(),
})
  .openapi('PaymentViaInn')

export const insertPaymentViaInnSchema = z.object({
  companyInnId: z.string().uuid(),
  paymentId: z.string().uuid(),
})
  .openapi('CreatePaymentViaInn')

export const patchPaymentViaInnSchema = insertPaymentViaInnSchema
  .partial()
  .openapi('UpdatePaymentViaInn')
