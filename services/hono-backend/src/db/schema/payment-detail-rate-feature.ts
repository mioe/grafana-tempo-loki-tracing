import { z } from '@hono/zod-openapi'
import { foreignKey, pgTable, uuid } from 'drizzle-orm/pg-core'

import { cost, qtyMonths } from '../helpers'
import { companyRateFeatureTable } from './company-rate-feature'
import { currencyTable } from './currency'
import { paymentTable } from './payment'

export const paymentDetailRateFeatureTable = pgTable('payment_detail_rate_feature', {
  paymentId: uuid().notNull(),
  companyRateFeatureId: uuid().notNull(),
  currencyId: uuid().notNull(),
  qtyMonths,
  cost: cost(),
  discountCost: cost('discount_cost'),
}, t => [
  foreignKey({
    name: 'pd_rate_feature_payment_fk',
    columns: [t.paymentId],
    foreignColumns: [paymentTable.id],
  }),
  foreignKey({
    name: 'pd_rate_feature_company_fk',
    columns: [t.companyRateFeatureId],
    foreignColumns: [companyRateFeatureTable.id],
  }),
  foreignKey({
    name: 'pd_rate_feature_currency_fk',
    columns: [t.currencyId],
    foreignColumns: [currencyTable.id],
  }),
])

export const selectPaymentDetailRateFeatureSchema = z.object({
  paymentId: z.string().uuid(),
  companyRateFeatureId: z.string().uuid(),
  currencyId: z.string().uuid(),
  qtyMonths: z.number().int().positive(),
  cost: z.number().positive(),
  discountCost: z.number().positive(),
})
  .openapi('PaymentDetailRateFeature')

export const insertPaymentDetailRateFeatureSchema = z.object({
  paymentId: z.string().uuid(),
  companyRateFeatureId: z.string().uuid(),
  currencyId: z.string().uuid(),
  qtyMonths: z.number().int().positive(),
  cost: z.number().positive(),
  discountCost: z.number().positive(),
})
  .openapi('CreatePaymentDetailRateFeature')

export const patchPaymentDetailRateFeatureSchema = insertPaymentDetailRateFeatureSchema
  .partial()
  .openapi('UpdatePaymentDetailRateFeature')
