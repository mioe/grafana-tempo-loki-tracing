import * as HttpStatusCodes from 'stoker/http-status-codes'
import * as HttpStatusPhrases from 'stoker/http-status-phrases'

import type { AppRouteHandler } from '~/lib/types'

import db from '~/db'

import type { GetOneRoute, ListRoute } from './currency.route'

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const rates = await db.query.currencyTable.findMany()
  return c.json(rates)
}

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid('param')
  const rate = await db.query.currencyTable.findFirst({
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
