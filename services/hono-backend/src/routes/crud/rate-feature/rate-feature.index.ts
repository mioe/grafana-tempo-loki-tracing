import { createRouter } from '~/lib/create-app'

import * as handler from './rate-feature.handler'
import * as route from './rate-feature.route'

const router = createRouter()
  .openapi(route.list, handler.list)
  .openapi(route.create, handler.create)
  .openapi(route.getOne, handler.getOne)
  .openapi(route.patch, handler.patch)

export default router
