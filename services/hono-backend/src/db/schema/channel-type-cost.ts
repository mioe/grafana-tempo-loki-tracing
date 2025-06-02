import { z } from '@hono/zod-openapi'
import { pgTable, uuid } from 'drizzle-orm/pg-core'

import { cost, createdAt, id, SCHEMA_PATCH_DATE } from '../helpers'
import { channelTypeTable } from './channel-type'
import { currencyTable } from './currency'

export const channelTypeCostTable = pgTable('channel_type_cost', {
  id,
  channelTypeId: uuid().notNull().references(() => channelTypeTable.id),
  currencyId: uuid().notNull().references(() => currencyTable.id),
  cost: cost(),
  createdAt,
})

export const selectChannelTypeCostSchema = z.object({
  id: z.string().uuid(),
  channelTypeId: z.string().uuid(),
  currencyId: z.string().uuid(),
  cost: z.number().positive(),
  createdAt: SCHEMA_PATCH_DATE,
})
  .openapi('ChannelTypeCost')

export const insertChannelTypeCostSchema = z.object({
  channelTypeId: z.string().uuid(),
  currencyId: z.string().uuid(),
  cost: z.number().positive(),
})
  .openapi('CreateChannelTypeCost')

export const patchChannelTypeCostSchema = insertChannelTypeCostSchema
  .partial()
  .openapi('UpdateChannelTypeCost')
