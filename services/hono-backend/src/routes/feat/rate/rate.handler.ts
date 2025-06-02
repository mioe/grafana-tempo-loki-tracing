import type { AppRouteHandler } from '~/lib/types'

import db from '~/db'

import type { ListRoute } from './rate.route'

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const rates = await db.query.rateTable.findMany()
  return c.json(rates)
}
