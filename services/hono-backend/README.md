# hono-backend

> billing-backend - доступный и простой бэкенд для оплат всего Йогурта

## Установка и локальный запуск

Перед запуском необходимо поднять [starter-kit](https://gitlab.yourgood.ru/shared/auth-service/starter-kit)

```sh
git clone
cd hono-backend
npm install
cp .env.starter-kit .env
npx drizzle-kit migrate
npm run dev
```

Часто используемые команды:

```sh
# фиксация изменений в схемах /src/db/schema/
npx drizzle-kit generate --name add_missing_column

# для генерации пустого SQL файла, например нужно сделать seed
npx drizzle-kit generate --custom --name=seed_rate

# чтобы все попало в db
npx drizzle-kit migrate
```

## Рекомендации по работе с eslint-ом

### vscode settings

```json
{
  // Disable the default formatter, use eslint instead
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // Auto fix
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  }
}
```

### zed settings

```json
{
  "formatter": {
    "code_actions": {
      "source.fixAll.eslint": true
    }
  }
}
```

## References

- [What is Open API?](https://swagger.io/docs/specification/v3_0/about/)
- [Hono](https://hono.dev/)
  - [Zod OpenAPI Example](https://hono.dev/examples/zod-openapi)
  - [Testing](https://hono.dev/docs/guides/testing)
  - [Testing Helper](https://hono.dev/docs/helpers/testing)
- [@hono/zod-openapi](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)
- [Scalar Documentation](https://github.com/scalar/scalar/tree/main/?tab=readme-ov-file#documentation)
  - [Themes / Layout](https://github.com/scalar/scalar/blob/main/documentation/themes.md)
  - [Configuration](https://github.com/scalar/scalar/blob/main/documentation/configuration.md)
- [stoker - utilities for hono and @hono/zod-openapi](https://github.com/w3cj/stoker)
- [starter template for hono](https://github.com/w3cj/hono-open-api-starter/tree/drizzle-v0.35)
