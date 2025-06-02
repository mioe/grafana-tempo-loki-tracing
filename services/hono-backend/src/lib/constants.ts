import { z } from '@hono/zod-openapi'
import * as HttpStatusPhrases from 'stoker/http-status-phrases'
import { createMessageObjectSchema } from 'stoker/openapi/schemas'

export const ZOD_ERROR_MESSAGES = {
  REQUIRED: 'Required',
  EXPECTED_NUMBER: 'Expected number, received nan',
  NO_UPDATES: 'No updates provided',
}

export const ZOD_ERROR_CODES = {
  INVALID_UPDATES: 'invalid_updates',
}

export const SECURITY_CUSTOM_ERROR = {
  MISSING_REQUIRED_SECURITY_HEADER: 'Something went wrong (e4324_01)',
  INVALID_SECURITY_SIGNATURE: 'Something went wrong (e4324_02)',
}

export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND)

export const IdParamsSchema = z.object({
  id: z.string().uuid().openapi({
    param: {
      name: 'id',
      in: 'path',
      description: 'the unique identifier',
      required: true,
    },
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
})
