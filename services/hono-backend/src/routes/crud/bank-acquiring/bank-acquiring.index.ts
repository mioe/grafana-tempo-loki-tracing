import { createRouter } from '~/lib/create-app'

import * as handler from './bank-acquiring.handler'
import * as route from './bank-acquiring.route'

const router = createRouter()
  .openapi(route.list, handler.list)
  .openapi(route.getOne, handler.getOne)

export default router
