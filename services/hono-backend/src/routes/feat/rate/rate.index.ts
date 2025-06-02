import { createRouter } from '~/lib/create-app'

import * as handler from './rate.handler'
import * as route from './rate.route'

const router = createRouter()
  .openapi(route.list, handler.list)

export default router
