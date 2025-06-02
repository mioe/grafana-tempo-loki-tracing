import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent } from 'stoker/openapi/helpers'
import { createErrorSchema } from 'stoker/openapi/schemas'

import { selectBankAcquiringSchema } from '~/db/schema-bundle'
import { TAG } from '~/lib/configure-open-api'
import { IdParamsSchema, notFoundSchema } from '~/lib/constants'

const tags = [TAG.CRUD_BANK_ACQUIRING.name]
const path = '/crud/bank-acquiring'

export const list = createRoute({
  path,
  method: 'get',
  tags,
  summary: 'Получение списка банков',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectBankAcquiringSchema),
      'The list of acquiring',
    ),
  },
})

export const getOne = createRoute({
  path: `${path}/{id}`,
  method: 'get',
  tags,
  summary: 'Получение банка по ID',
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectBankAcquiringSchema,
      'The requested acquiring',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Acquiring not found',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error',
    ),
  },
})

export type ListRoute = typeof list
export type GetOneRoute = typeof getOne
