import configureOpenAPI from '~/lib/configure-open-api'
import createApp from '~/lib/create-app'
import crudBankAcquiring from '~/routes/crud/bank-acquiring/bank-acquiring.index'
import crudCurrency from '~/routes/crud/currency/currency.index'
import crudRateFeature from '~/routes/crud/rate-feature/rate-feature.index'
import crudRate from '~/routes/crud/rate/rate.index'
import featAuth from '~/routes/feat/auth/auth.index'
import featRate from '~/routes/feat/rate/rate.index'
import index from '~/routes/index.route'

const app = createApp()

configureOpenAPI(app)

const routes = [
  crudBankAcquiring,
  crudRate,
  crudRateFeature,
  index,
  crudCurrency,
  featRate,
  featAuth,
] as const

routes.forEach((route) => {
  app.route('/api', route)
})

export type AppType = typeof routes[number]

export default app
