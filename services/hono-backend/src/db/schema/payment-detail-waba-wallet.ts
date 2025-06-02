import { z } from '@hono/zod-openapi'
import { foreignKey, pgTable, uuid } from 'drizzle-orm/pg-core'

import { cost } from '../helpers'
import { companyWabaWalletTable } from './company-waba-wallet'
import { currencyTable } from './currency'
import { paymentTable } from './payment'

export const paymentDetailWabaWalletTable = pgTable('payment_detail_waba_wallet', {
  paymentId: uuid().notNull(),
  companyWabaWalletId: uuid().notNull(),
  currencyId: uuid().notNull(),
  cost: cost(),
}, t => [
  foreignKey({
    name: 'pd_waba_wallet_payment_fk',
    columns: [t.paymentId],
    foreignColumns: [paymentTable.id],
  }),
  foreignKey({
    name: 'pd_waba_wallet_company_fk',
    columns: [t.companyWabaWalletId],
    foreignColumns: [companyWabaWalletTable.id],
  }),
  foreignKey({
    name: 'pd_waba_wallet_currency_fk',
    columns: [t.currencyId],
    foreignColumns: [currencyTable.id],
  }),
])

export const selectPaymentDetailWabaWalletSchema = z.object({
  paymentId: z.string().uuid(),
  companyWabaWalletId: z.string().uuid(),
  currencyId: z.string().uuid(),
  cost: z.number().positive(),
})
  .openapi('PaymentDetailWabaWallet')

export const insertPaymentDetailWabaWalletSchema = z.object({
  paymentId: z.string().uuid(),
  companyWabaWalletId: z.string().uuid(),
  currencyId: z.string().uuid(),
  cost: z.number().positive(),
})
  .openapi('CreatePaymentDetailWabaWallet')

export const patchPaymentDetailWabaWalletSchema = insertPaymentDetailWabaWalletSchema
  .partial()
  .openapi('UpdatePaymentDetailWabaWallet')
