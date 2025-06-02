import { createRouter } from '~/lib/create-app'

import * as handler from './currency.handler'
import * as route from './currency.route'

const router = createRouter()
  .openapi(route.list, handler.list)
  .openapi(route.getOne, handler.getOne)

export default router
