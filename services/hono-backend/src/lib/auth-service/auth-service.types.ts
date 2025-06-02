import { z } from 'zod'

export interface JWTPayload {
  userId: string
  phoneNumber: string | null
  email: string | null
  companyId: string | null
  fancyId: string | null
  privateCompanyId: string
  privateFancyId: string
  userRoleInCompany?: string
  exp: number
  iat: number
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export const authResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

export type AuthResponse = z.infer<typeof authResponseSchema>

export interface AuthService {
  refreshTokens: (refreshToken: string) => Promise<AuthResponse>
  verifyToken: (token: string) => Promise<JWTPayload>
}
