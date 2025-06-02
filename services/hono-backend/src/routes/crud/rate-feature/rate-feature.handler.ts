import { eq } from 'drizzle-orm'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import * as HttpStatusPhrases from 'stoker/http-status-phrases'

import type { AppRouteHandler } from '~/lib/types'

import db from '~/db'
import { rateFeatureTable } from '~/db/schema/rate-feature'
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from '~/lib/constants'

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute } from './rate-feature.route'

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const rates = await db.query.rateFeatureTable.findMany()
  return c.json(rates)
}

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const rate = c.req.valid('json')
  const [inserted] = await db.insert(rateFeatureTable).values(rate).returning()
  return c.json(inserted, HttpStatusCodes.CREATED)
}

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid('param')
  const rate = await db.query.rateFeatureTable.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id)
    },
  })

  if (!rate) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    )
  }

  return c.json(rate, HttpStatusCodes.OK)
}

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { id } = c.req.valid('param')
  const updates = c.req.valid('json')

  if (Object.keys(updates).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: 'ZodError',
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    )
  }

  const [rate] = await db.update(rateFeatureTable)
    .set(updates)
    .where(eq(rateFeatureTable.id, id))
    .returning()

  if (!rate) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    )
  }

  return c.json(rate, HttpStatusCodes.OK)
}
