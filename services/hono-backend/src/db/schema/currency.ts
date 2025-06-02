import { z } from '@hono/zod-openapi'
import { pgTable, varchar } from 'drizzle-orm/pg-core'

import { createdAt, id, name, SCHEMA_PATCH_DATE } from '../helpers'

export const currencyTable = pgTable('currency', {
  id,
  name,
  code: varchar({ length: 3 }).notNull(),
  createdAt,
})

export const selectCurrencySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  code: z.string().length(3),
  createdAt: SCHEMA_PATCH_DATE,
})
  .openapi('Currency')
