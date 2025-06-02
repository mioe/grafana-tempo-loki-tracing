// src/middlewares/jwt-auth.ts
import type { MiddlewareHandler } from 'hono'
import type { StringValue } from 'ms'

import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import ms from 'ms'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import * as HttpStatusPhrases from 'stoker/http-status-phrases'

import type { AppBindings } from '~/lib/types'

import env from '~/env'
import { authService } from '~/lib/auth-service/auth-service.handler'

const ACCESS_TOKEN_COOKIE = env.ACCESS_COOKIE_NAME
const REFRESH_TOKEN_COOKIE = env.REFRESH_COOKIE_NAME
const JWT_ACCESS_TOKEN_TTL = ms(env.JWT_ACCESS_TOKEN_TTL as StringValue)
const JWT_REFRESH_TOKEN_TTL = ms(env.JWT_REFRESH_TOKEN_TTL as StringValue)

export function jwtAuth(): MiddlewareHandler<AppBindings> {
  return async (c, next) => {
    const accessToken = getCookie(c, ACCESS_TOKEN_COOKIE)
    const refreshToken = getCookie(c, REFRESH_TOKEN_COOKIE)

    if (!accessToken && !refreshToken) {
      c.var.logger.warn({
        path: c.req.path,
        message: 'No authentication tokens found',
      })

      return c.json(
        {
          success: false,
          error: {
            message: HttpStatusPhrases.UNAUTHORIZED,
            details: 'Authentication required',
          },
        },
        HttpStatusCodes.UNAUTHORIZED,
      )
    }

    // пытаемся верифицировать access token
    if (accessToken) {
      try {
        const payload = await authService.verifyToken(accessToken)
        c.set('user', payload)

        c.var.logger.info({
          userId: payload.userId,
          message: 'Access token verified successfully',
        })

        return next()
      }
      catch (error) {
        c.var.logger.warn({
          error: error instanceof Error ? error.message : 'Unknown error',
          message: 'Access token verification failed',
        })
      }
    }

    if (refreshToken) {
      try {
        const authResponse = await authService.refreshTokens(refreshToken)

        setCookie(c, ACCESS_TOKEN_COOKIE, authResponse.accessToken, {
          httpOnly: true,
          secure: env.NODE_ENV === 'production',
          sameSite: 'none',
          maxAge: JWT_ACCESS_TOKEN_TTL,
          path: env.SHARED_COOKIE_HOST,
        })

        setCookie(c, REFRESH_TOKEN_COOKIE, authResponse.refreshToken, {
          httpOnly: true,
          secure: env.NODE_ENV === 'production',
          sameSite: 'none',
          maxAge: JWT_REFRESH_TOKEN_TTL,
          path: env.SHARED_COOKIE_HOST,
        })

        const payload = await authService.verifyToken(authResponse.accessToken)
        c.set('user', payload)

        c.var.logger.info({
          userId: payload.userId,
          companyId: payload.companyId,
          message: 'Tokens refreshed successfully',
        })

        return next()
      }
      catch (error) {
        c.var.logger.warn({
          error: error instanceof Error ? error.message : 'Unknown error',
          message: 'Token refresh failed',
        })

        deleteCookie(c, ACCESS_TOKEN_COOKIE)
        deleteCookie(c, REFRESH_TOKEN_COOKIE)
      }
    }

    return c.json(
      {
        success: false,
        error: {
          message: HttpStatusPhrases.UNAUTHORIZED,
          details: 'Invalid or expired authentication tokens',
        },
      },
      HttpStatusCodes.UNAUTHORIZED,
    )
  }
}

export function optionalJwtAuth(): MiddlewareHandler<AppBindings> {
  return async (c, next) => {
    const accessToken = getCookie(c, ACCESS_TOKEN_COOKIE)

    if (accessToken) {
      try {
        const payload = await authService.verifyToken(accessToken)
        c.set('user', payload)

        c.var.logger.info({
          userId: payload.userId,
          companyId: payload.companyId,
          message: 'Optional auth: user authenticated',
        })
      }
      catch (error) {
        c.var.logger.debug({
          error: error instanceof Error ? error.message : 'Unknown error',
          message: 'Optional auth: token verification failed',
        })
      }
    }

    return next()
  }
}
