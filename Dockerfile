# deps
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm i --frozen-lockfile; \
  else npm i; fi

# build
FROM node:20-alpine AS builder
WORKDIR /app
ARG NEXT_PUBLIC_ROOT_DOMAIN=
ARG NEXT_PUBLIC_APP_PORT=3001
ARG NEXT_PUBLIC_API_ORIGIN=
ARG NEXT_PUBLIC_RESERVED_SUBDOMAINS=www,api
ARG PLATFORM_ROOT_DOMAIN=
ENV NODE_ENV=production \
  NEXT_PUBLIC_ROOT_DOMAIN=${NEXT_PUBLIC_ROOT_DOMAIN} \
  NEXT_PUBLIC_APP_PORT=${NEXT_PUBLIC_APP_PORT} \
  NEXT_PUBLIC_API_ORIGIN=${NEXT_PUBLIC_API_ORIGIN} \
  NEXT_PUBLIC_RESERVED_SUBDOMAINS=${NEXT_PUBLIC_RESERVED_SUBDOMAINS} \
  PLATFORM_ROOT_DOMAIN=${PLATFORM_ROOT_DOMAIN}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# run
FROM node:20-alpine AS runner
WORKDIR /app
ARG NEXT_PUBLIC_ROOT_DOMAIN=
ARG NEXT_PUBLIC_APP_PORT=3001
ARG NEXT_PUBLIC_API_ORIGIN=
ARG INTERNAL_API_ORIGIN=
ARG NEXT_PUBLIC_RESERVED_SUBDOMAINS=www,api
ARG PLATFORM_ROOT_DOMAIN=
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV NEXT_PUBLIC_ROOT_DOMAIN=${NEXT_PUBLIC_ROOT_DOMAIN} \
  NEXT_PUBLIC_APP_PORT=${NEXT_PUBLIC_APP_PORT} \
  NEXT_PUBLIC_API_ORIGIN=${NEXT_PUBLIC_API_ORIGIN} \
  INTERNAL_API_ORIGIN=${INTERNAL_API_ORIGIN} \
  NEXT_PUBLIC_RESERVED_SUBDOMAINS=${NEXT_PUBLIC_RESERVED_SUBDOMAINS} \
  PLATFORM_ROOT_DOMAIN=${PLATFORM_ROOT_DOMAIN}

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "run", "start"]
