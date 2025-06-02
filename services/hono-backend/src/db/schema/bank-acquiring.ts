import { z } from '@hono/zod-openapi'
import { pgTable } from 'drizzle-orm/pg-core'

import { createdAt, id, name, SCHEMA_PATCH_DATE } from '../helpers'

export const bankAcquiringTable = pgTable('bank_acquiring', {
  id,
  name,
  createdAt,
})

export const selectBankAcquiringSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  createdAt: SCHEMA_PATCH_DATE,
})
  .openapi('BankAcquiring')
