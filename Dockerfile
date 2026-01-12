# -------------------------
# Base (Node + pnpm via corepack)
# -------------------------
FROM node:20-alpine AS base
WORKDIR /app

# -------------------------
# Stage 1: Dependencies
# -------------------------
FROM base AS deps
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# -------------------------
# Stage 2: Build
# -------------------------

FROM base AS builder
RUN corepack enable

ARG PAYLOAD_SECRET
ARG DATABASE_URI
ARG SKIP_BUILD_DB
ARG NEXT_PUBLIC_SERVER_URL
ARG VERCEL_PROJECT_PRODUCTION_URL

ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV DATABASE_URI=$DATABASE_URI
ENV SKIP_BUILD_DB=$SKIP_BUILD_DB
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV VERCEL_PROJECT_PRODUCTION_URL=$VERCEL_PROJECT_PRODUCTION_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# -------------------------
# Stage 3: Production runner
# -------------------------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# If you run `pnpm run server.js` you need pnpm at runtime:
RUN corepack enable

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
# CMD ["node", "server.js"]
CMD HOSTNAME="0.0.0.0" node server.js
