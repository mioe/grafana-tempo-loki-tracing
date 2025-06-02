import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent } from 'stoker/openapi/helpers'
import { createErrorSchema } from 'stoker/openapi/schemas'

import { selectCurrencySchema } from '~/db/schema-bundle'
import { TAG } from '~/lib/configure-open-api'
import { IdParamsSchema, notFoundSchema } from '~/lib/constants'

const tags = [TAG.CRUD_CURRENCY.name]
const path = '/crud/currency'

export const list = createRoute({
  path,
  method: 'get',
  tags,
  summary: 'Получение списка валют',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectCurrencySchema),
      'The list of currencies',
    ),
  },
})

export const getOne = createRoute({
  path: `${path}/{id}`,
  method: 'get',
  tags,
  summary: 'Получение валюты по ID',
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectCurrencySchema,
      'The requested currency',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Currency not found',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error',
    ),
  },
})

export type ListRoute = typeof list
export type GetOneRoute = typeof getOne
