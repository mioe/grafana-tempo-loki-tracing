import { z } from '@hono/zod-openapi'
import { boolean, pgTable, unique, uuid } from 'drizzle-orm/pg-core'

import { companyId, createdAt, expAt, id, qtyMonths, SCHEMA_PATCH_DATE } from '../helpers'
import { channelTypeTable } from './channel-type'

export const companyChannelSlotTable = pgTable('company_channel_slot', {
  id,
  companyId,
  companyChannelId: uuid().notNull(),
  channelTypeId: uuid().notNull().references(() => channelTypeTable.id),
  expAt,
  qtyMonths,
  autopayment: boolean().notNull(),
  createdAt,
}, t => [
  // сокращение cc === company_channel
  unique('uq_cc_slot_company_id_cc_id')
    .on(t.companyId, t.companyChannelId),
])

export const selectCompanyChannelSlotSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  companyChannelId: z.string().uuid(),
  channelTypeId: z.string().uuid(),
  expAt: SCHEMA_PATCH_DATE.nullable(),
  qtyMonths: z.number().int().positive().nullable(),
  autopayment: z.boolean(),
  createdAt: SCHEMA_PATCH_DATE,
})
  .openapi('CompanyChannelSlot')

export const insertCompanyChannelSlotSchema = z.object({
  companyId: z.string().uuid(),
  companyChannelId: z.string().uuid(),
  channelTypeId: z.string().uuid(),
  expAt: SCHEMA_PATCH_DATE.optional().nullable(),
  qtyMonths: z.number().int().positive().optional().nullable(),
  autopayment: z.boolean(),
})
  .openapi('CreateCompanyChannelSlot')

export const patchCompanyChannelSlotSchema = insertCompanyChannelSlotSchema
  .partial()
  .openapi('UpdateCompanyChannelSlot')
