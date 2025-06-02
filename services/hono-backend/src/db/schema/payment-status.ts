import { z } from '@hono/zod-openapi'
import { pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core'

import { createdAt, id, SCHEMA_PATCH_DATE } from '../helpers'
import { paymentTable } from './payment'

export const paymentStatusTypeEnum = pgEnum(
  'payment_status_type',
  ['pending', 'success', 'failed'],
)

export const paymentStatusTable = pgTable('payment_status', {
  id,
  paymentId: uuid().notNull().references(() => paymentTable.id),
  status: paymentStatusTypeEnum().notNull(),
  breadcrumbs: text().notNull(),
  createdAt,
})

export const selectPaymentStatusSchema = z.object({
  id: z.string().uuid(),
  paymentId: z.string().uuid(),
  status: z.enum(['pending', 'success', 'failed']),
  breadcrumbs: z.string(),
  createdAt: SCHEMA_PATCH_DATE,
})
  .openapi('PaymentStatus')

export const insertPaymentStatusSchema = z.object({
  paymentId: z.string().uuid(),
  status: z.enum(['pending', 'success', 'failed']),
  breadcrumbs: z.string(),
})
  .openapi('CreatePaymentStatus')

export const patchPaymentStatusSchema = insertPaymentStatusSchema
  .partial()
  .openapi('UpdatePaymentStatus')
