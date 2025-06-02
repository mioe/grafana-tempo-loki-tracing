import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { createErrorSchema } from 'stoker/openapi/schemas'

import { insertRateFeatureSchema, patchRateFeatureSchema, selectRateFeatureSchema } from '~/db/schema-bundle'
import { TAG } from '~/lib/configure-open-api'
import { IdParamsSchema, notFoundSchema } from '~/lib/constants'

const tags = [TAG.CRUD_RATE_FEATURE.name]
const path = '/crud/rate-feature'

export const list = createRoute({
  path,
  method: 'get',
  tags,
  summary: 'Получение всех фичей',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectRateFeatureSchema),
      'The list of rate features',
    ),
  },
})

export const create = createRoute({
  path,
  method: 'post',
  tags,
  summary: 'Создание тарифной фичи',
  request: {
    body: jsonContentRequired(
      insertRateFeatureSchema,
      'The rate feature to create',
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectRateFeatureSchema,
      'The created rate feature',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertRateFeatureSchema),
      'The validation error(s)',
    ),
  },
})

export const getOne = createRoute({
  path: `${path}/{id}`,
  method: 'get',
  tags,
  summary: 'Получение фичи по ID',
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectRateFeatureSchema,
      'The requested rate feature',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Rate feature not found',
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
  summary: 'Обновление фичи тарифа',
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchRateFeatureSchema,
      'The rate feature updates',
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectRateFeatureSchema,
      'The updated rate feature',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Rate feature not found',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchRateFeatureSchema)
        .or(createErrorSchema(IdParamsSchema)),
      'The validation error(s)',
    ),
  },
})

export type ListRoute = typeof list
export type CreateRoute = typeof create
export type GetOneRoute = typeof getOne
export type PatchRoute = typeof patch
