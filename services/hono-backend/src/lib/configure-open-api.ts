import { Scalar } from '@scalar/hono-api-reference'

import env from '~/env'

import type { AppOpenAPI } from './types'

import packageJSON from '../../package.json' with { type: 'json' }

export const TAG = {
  CRUD_RATE: {
    name: 'CRUD -> Rate',
    description: 'Все тарифы для всех продуктов Йогурта.',
  },
  CRUD_RATE_FEATURE: {
    name: 'CRUD -> Rate feature',
    description: 'Набор доступных фичей в рамках тарифа.<br/> (eg. https://zed.dev/pricing - *500 prompts per month*).',
  },
  CRUD_BANK_ACQUIRING: {
    name: 'CRUD -> Bank acquiring',
    description: 'Поддерживаемые сервисы для удаленных оплат картой, qr-кодов и тд. Заполняются **ТОЛЬКО** при помощи seed-ов.',
  },
  CRUD_CURRENCY: {
    name: 'CRUD -> Currency',
    description: 'Поддерживаемые валюты. Заполняются **ТОЛЬКО** при помощи seed-ов.',
  },
  FEAT_RATE: {
    name: 'Feat -> Rate',
    description: 'Получения доступных тарифов для конкретной компании.',
  },
  FEAT_AUTH: {
    name: 'Feat -> Auth',
    description: 'Взаимодействие с auth-service-ом.',
  },
}

export default function configureOpenAPI(app: AppOpenAPI) {
  if (env.ENABLE_SCALAR_API_DOCS === 'true') {
    app.openAPIRegistry.registerComponent('securitySchemes', 'JWTCookie', {
      type: 'apiKey',
      in: 'cookie',
      name: env.ACCESS_COOKIE_NAME,
      description: 'JWT protection http-only-cookie',
    })

    app.openAPIRegistry.registerComponent('securitySchemes', 'CSRFGuard', {
      type: 'apiKey',
      in: 'header',
      name: 'x-signature',
      description: 'CSRF protection signature header',
    })

    app.doc('/api/doc', {
      openapi: '3.0.0',
      info: {
        version: packageJSON.version,
        title: packageJSON.description,
      },
      tags: [
        { name: 'Index', description: 'Debug, исследование, проверки чего либо.' },
        ...Object.values(TAG).sort((a, b) => a.name.localeCompare(b.name)),
      ],
    })

    app.get(
      '/api/ref',
      Scalar({
        defaultHttpClient: {
          targetKey: 'shell',
          clientKey: 'curl',
        },
        url: '/api/doc',
      }),
    )
  }
}
