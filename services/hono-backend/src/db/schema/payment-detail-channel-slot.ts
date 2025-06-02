import { z } from '@hono/zod-openapi'
import { foreignKey, pgTable, uuid } from 'drizzle-orm/pg-core'

import { cost, qtyMonths } from '../helpers'
import { companyChannelSlotTable } from './company-channel-slot'
import { currencyTable } from './currency'
import { paymentTable } from './payment'

export const paymentDetailChannelSlotTable = pgTable('payment_detail_channel_slot', {
  paymentId: uuid().notNull(),
  companyChannelSlotId: uuid().notNull(),
  currencyId: uuid().notNull(),
  qtyMonths,
  cost: cost(),
  discountCost: cost('discount_cost'),
}, t => [
  foreignKey({
    name: 'pd_channel_slot_payment_fk',
    columns: [t.paymentId],
    foreignColumns: [paymentTable.id],
  }),
  foreignKey({
    name: 'pd_channel_slot_company_fk',
    columns: [t.companyChannelSlotId],
    foreignColumns: [companyChannelSlotTable.id],
  }),
  foreignKey({
    name: 'pd_channel_slot_currency_fk',
    columns: [t.currencyId],
    foreignColumns: [currencyTable.id],
  }),
])

export const selectPaymentDetailChannelSlotSchema = z.object({
  paymentId: z.string().uuid(),
  companyChannelSlotId: z.string().uuid(),
  currencyId: z.string().uuid(),
  qtyMonths: z.number().int().positive(),
  cost: z.number().positive(),
  discountCost: z.number().positive(),
})
  .openapi('PaymentDetailChannelSlot')

export const insertPaymentDetailChannelSlotSchema = z.object({
  paymentId: z.string().uuid(),
  companyChannelSlotId: z.string().uuid(),
  currencyId: z.string().uuid(),
  qtyMonths: z.number().int().positive(),
  cost: z.number().positive(),
  discountCost: z.number().positive(),
})
  .openapi('CreatePaymentDetailChannelSlot')

export const patchPaymentDetailChannelSlotSchema = insertPaymentDetailChannelSlotSchema
  .partial()
  .openapi('UpdatePaymentDetailChannelSlot')
