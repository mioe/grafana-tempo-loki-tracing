import { drizzle } from 'drizzle-orm/postgres-js'

import env from '~/env'

import * as schema from './schema-bundle'

const db = drizzle({
  connection: {
    url: env.DATABASE_URL,
  },
  casing: 'snake_case',
  schema,
})

export default db

// todo: добавить комментарии к колонкам
// https://github.com/drizzle-team/drizzle-orm/pull/4446
