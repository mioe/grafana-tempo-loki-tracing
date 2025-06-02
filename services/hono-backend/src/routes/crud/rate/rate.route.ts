import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { createErrorSchema } from 'stoker/openapi/schemas'

import { insertRateSchema, patchRateSchema, selectRateSchema } from '~/db/schema-bundle'
import { TAG } from '~/lib/configure-open-api'
import { IdParamsSchema, notFoundSchema } from '~/lib/constants'

const tags = [TAG.CRUD_RATE.name]
const path = '/crud/rate'

export const list = createRoute({
  path,
  method: 'get',
  tags,
  summary: 'Получение тарифов',
  description: 'Только верхнеуровневая информация, без rate_feature',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectRateSchema),
      'The list of rates',
    ),
  },
})

export const create = createRoute({
  path,
  method: 'post',
  tags,
  summary: 'Создание тарифа',
  request: {
    body: jsonContentRequired(
      insertRateSchema,
      'The rate to create',
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectRateSchema,
      'The created rate',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertRateSchema),
      'The validation error(s)',
    ),
  },
})

export const getOne = createRoute({
  path: `${path}/{id}`,
  method: 'get',
  tags,
  summary: 'Получение тарифа по ID',
  description: 'Только верхнеуровневая информация о тарифе по ID, без rate_feature',
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectRateSchema,
      'The requested rate',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Rate not found',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error',
    ),
  },
})

export const patch = createRoute({
  path: `${path}/{id}`,
  method: 'patch',
  tags,
  summary: 'Обновление тарифа',
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchRateSchema,
      'The brand updates',
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectRateSchema,
      'The updated rate',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Rate not found',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchRateSchema)
        .or(createErrorSchema(IdParamsSchema)),
      'The validation error(s)',
    ),
  },
})

export type ListRoute = typeof list
export type CreateRoute = typeof create
export type GetOneRoute = typeof getOne
export type PatchRoute = typeof patch
