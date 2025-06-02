import jwt from 'jsonwebtoken'

import env from '~/env'

import type { AuthResponse, AuthService, JWTPayload } from './auth-service.types'

class AuthServiceImpl implements AuthService {
  private readonly baseUrl: string
  private readonly jwtSecret: string

  constructor(baseUrl: string, jwtSecret: string) {
    this.baseUrl = baseUrl
    this.jwtSecret = jwtSecret
  }

  async refreshTokens(refreshToken: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/api/v2/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      throw new Error(`Failed to refresh tokens: ${response.status}`)
    }

    return response.json()
  }

  async verifyToken(token: string): Promise<JWTPayload> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JWTPayload
      return decoded
    }
    catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new TypeError('Token expired')
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new TypeError('Invalid token signature')
      }
      if (error instanceof jwt.NotBeforeError) {
        throw new TypeError('Token not active')
      }

      throw new Error('Token verification failed')
    }
  }
}

export const authService = new AuthServiceImpl(
  env.AUTH_SERVICE_BACKEND_URL,
  env.JWT_ACCESS_SALT,
)
