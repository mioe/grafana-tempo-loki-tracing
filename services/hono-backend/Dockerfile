# install dependencies && build project 📦
from node:22-alpine as builder
workdir /usr/src/app
copy package*.json ./
run node --version
run npm ci
copy . .
run npm run build

# migration entities && starter project 🎸
from node:22-alpine as prod
workdir /usr/src/app

copy --from=builder /usr/src/app/.drizzle ./.drizzle
copy --from=builder /usr/src/app/dist ./dist
copy --from=builder /usr/src/app/node_modules ./node_modules
copy --from=builder /usr/src/app/.env .env
copy --from=builder /usr/src/app/drizzle.config.ts ./
copy --from=builder /usr/src/app/package*.json ./

run npx drizzle-kit migrate --config dist/drizzle.config.js
expose 4324
cmd ["npm", "run", "start"]
