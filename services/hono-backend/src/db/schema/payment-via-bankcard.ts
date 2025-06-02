import { z } from '@hono/zod-openapi'
import { pgTable, uuid } from 'drizzle-orm/pg-core'

import { bankcardTable } from './bankcard'
import { paymentTable } from './payment'

export const paymentViaBankcardTable = pgTable('payment_via_bankcard', {
  bankcardId: uuid().notNull().references(() => bankcardTable.id),
  paymentId: uuid().notNull().references(() => paymentTable.id),
})

export const selectPaymentViaBankcardSchema = z.object({
  bankcardId: z.string().uuid(),
  paymentId: z.string().uuid(),
})
  .openapi('PaymentViaBankcard')

export const insertPaymentViaBankcardSchema = z.object({
  bankcardId: z.string().uuid(),
  paymentId: z.string().uuid(),
})
  .openapi('CreatePaymentViaBankcard')

export const patchPaymentViaBankcardSchema = insertPaymentViaBankcardSchema
  .partial()
  .openapi('UpdatePaymentViaBankcard')
