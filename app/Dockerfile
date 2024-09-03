FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

# install chroumium and other needed dependencies
RUN apk add --no-cache \
    udev \
    ttf-freefont \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    fontconfig \
    curl

# required to force puppeteer to use installed chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package*.json ./

RUN npm ci --omit=dev

ENTRYPOINT ["node", "dist/index.js"]
