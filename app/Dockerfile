FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

FROM ghcr.io/puppeteer/puppeteer:23.1.1 AS production

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package*.json ./

RUN npm ci --omit=dev

ENTRYPOINT ["node", "dist/index.js"]
