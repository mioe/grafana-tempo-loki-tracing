import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent } from 'stoker/openapi/helpers'
import { createMessageObjectSchema } from 'stoker/openapi/schemas'

import { TAG } from '~/lib/configure-open-api'

const tags = [TAG.FEAT_AUTH.name]
const path = '/feat/auth'

export const me = createRoute({
  path: `${path}/me`,
  method: 'get',
  tags,
  summary: 'Get current user',
  description: 'Get current authenticated user information',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        userId: z.string().uuid(),
        phoneNumber: z.string().nullable(),
        email: z.string().nullable(),
        companyId: z.string().uuid().nullable(),
        fancyId: z.string().nullable(),
        privateCompanyId: z.string().uuid(),
        privateFancyId: z.string(),
        userRoleInCompany: z.string().optional(),
      }),
      'Current user information',
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema('Unauthorized'),
      'User not authenticated',
    ),
  },
})

export const refreshTokens = createRoute({
  path: `${path}/refresh`,
  method: 'post',
  tags,
  summary: 'Refresh authentication tokens',
  description: 'Refresh access and refresh tokens using existing refresh token',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createMessageObjectSchema('Tokens refreshed successfully'),
      'Tokens refreshed',
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema('Invalid refresh token'),
      'Refresh failed',
    ),
  },
})

export type MeRoute = typeof me
export type RefreshTokensRoute = typeof refreshTokens
