import { z } from '@hono/zod-openapi'
import { pgTable } from 'drizzle-orm/pg-core'

import { createdAt, id, name, SCHEMA_PATCH_DATE } from '../helpers'

export const channelTypeTable = pgTable('channel_type', {
  id,
  name,
  createdAt,
})

export const selectChannelTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  createdAt: SCHEMA_PATCH_DATE,
})
  .openapi('ChannelType')

export const insertChannelTypeSchema = z.object({
  name: z.string().min(1).max(255),
})
  .openapi('CreateChannelType')

export const patchChannelTypeSchema = insertChannelTypeSchema
  .partial()
  .openapi('UpdateChannelType')
