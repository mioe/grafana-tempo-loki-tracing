import { createRouter } from '~/lib/create-app'
import { jwtAuth } from '~/middlewares/jwt-auth'

import * as handler from './auth.handler'
import * as route from './auth.route'

const router = createRouter()
  .openapi(route.refreshTokens, handler.refreshTokens)

const protectedRouter = createRouter()
  .use(jwtAuth())
  .openapi(route.me, handler.me)

export default createRouter()
  .route('/', router)
  .route('/', protectedRouter)
