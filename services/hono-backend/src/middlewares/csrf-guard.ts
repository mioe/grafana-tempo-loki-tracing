import type { MiddlewareHandler } from 'hono'

import * as HttpStatusCodes from 'stoker/http-status-codes'
import * as HttpStatusPhrases from 'stoker/http-status-phrases'

import type { AppBindings } from '~/lib/types'

import env from '~/env'
import { SECURITY_CUSTOM_ERROR } from '~/lib/constants'

const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'] as const
const SIGNATURE_HEADER = 'x-signature'

export function csrfGuard(): MiddlewareHandler<AppBindings> {
  return async (c, next) => {
    // Skip CSRF check for safe methods
    if (SAFE_METHODS.includes(c.req.method as typeof SAFE_METHODS[number])) {
      return next()
    }

    // Get the signature from the request header
    const signature = c.req.header(SIGNATURE_HEADER)

    // Check if signature exists
    if (!signature) {
      c.var.logger.warn({
        method: c.req.method,
        path: c.req.path,
        message: 'Missing X-Signature header',
      })

      return c.json(
        {
          success: false,
          error: {
            message: HttpStatusPhrases.FORBIDDEN,
            details: SECURITY_CUSTOM_ERROR.MISSING_REQUIRED_SECURITY_HEADER,
          },
        },
        HttpStatusCodes.FORBIDDEN,
      )
    }

    // Validate the signature
    if (signature !== env.X_SIGNATURE) {
      c.var.logger.warn({
        method: c.req.method,
        path: c.req.path,
        message: 'Invalid X-Signature',
        signature,
      })

      return c.json(
        {
          success: false,
          error: {
            message: HttpStatusPhrases.FORBIDDEN,
            details: SECURITY_CUSTOM_ERROR.INVALID_SECURITY_SIGNATURE,
          },
        },
        HttpStatusCodes.FORBIDDEN,
      )
    }

    return next()
  }
}
