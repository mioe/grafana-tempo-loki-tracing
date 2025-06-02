import type { StringValue } from 'ms'

import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import ms from 'ms'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import * as HttpStatusPhrases from 'stoker/http-status-phrases'

import type { AppRouteHandler } from '~/lib/types'

import env from '~/env'
import { authService } from '~/lib/auth-service/auth-service.handler'

import type { MeRoute, RefreshTokensRoute } from './auth.route'

const ACCESS_TOKEN_COOKIE = env.ACCESS_COOKIE_NAME
const REFRESH_TOKEN_COOKIE = env.REFRESH_COOKIE_NAME
const JWT_ACCESS_TOKEN_TTL = ms(env.JWT_ACCESS_TOKEN_TTL as StringValue)
const JWT_REFRESH_TOKEN_TTL = ms(env.JWT_REFRESH_TOKEN_TTL as StringValue)

export const me: AppRouteHandler<MeRoute> = async (c) => {
  const user = c.get('user')

  if (!user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED,
    )
  }

  return c.json(
    user,
    HttpStatusCodes.OK,
  )
}

export const refreshTokens: AppRouteHandler<RefreshTokensRoute> = async (c) => {
  const refreshToken = getCookie(c, REFRESH_TOKEN_COOKIE)

  if (!refreshToken) {
    return c.json(
      {
        message: 'No refresh token found',
      },
      HttpStatusCodes.UNAUTHORIZED,
    )
  }

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

    c.var.logger.info({
      message: 'Tokens refreshed successfully',
    })

    return c.json(
      {
        message: 'Tokens refreshed successfully',
      },
      HttpStatusCodes.OK,
    )
  }
  catch (error) {
    c.var.logger.warn({
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Token refresh failed',
    })

    deleteCookie(c, ACCESS_TOKEN_COOKIE)
    deleteCookie(c, REFRESH_TOKEN_COOKIE)

    return c.json(
      {
        message: 'Invalid refresh token',
      },
      HttpStatusCodes.UNAUTHORIZED,
    )
  }
}
