# ---- Base Node ----
FROM node:18-alpine AS base
WORKDIR /usr/src/app

RUN npm install -g pnpm


# ---- Dependencies ----
FROM base AS dependencies
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prod=false


# ---- Build ----
FROM base AS builder
WORKDIR /usr/src/app
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
RUN pnpm run build


# ---- Release ----
FROM node:18-alpine AS release
WORKDIR /usr/src/app

ENV NODE_ENV=prod

COPY --from=dependencies /usr/src/app/node_modules ./node_modules

COPY --from=builder /usr/src/app/dist ./dist
COPY package.json ./
EXPOSE 3000

USER node

CMD ["node", "dist/main.js"]