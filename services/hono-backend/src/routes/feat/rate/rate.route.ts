import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent } from 'stoker/openapi/helpers'

import { selectRateSchema } from '~/db/schema-bundle'
import { TAG } from '~/lib/configure-open-api'

const tags = [TAG.FEAT_RATE.name]
const path = '/feat/rate'

export const list = createRoute({
  path,
  method: 'get',
  tags,
  summary: 'Получение тарифов',
  description: 'Вся нужна информация для фронта и формирования оплаты',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectRateSchema),
      'The list of rates and all features',
    ),
  },
})

export type ListRoute = typeof list
