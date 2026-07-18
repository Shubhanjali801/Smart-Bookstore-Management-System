# syntax=docker/dockerfile:1

# ---------- deps: install production node_modules ----------
FROM node:22-alpine AS deps
WORKDIR /app
# Only copy manifests first so this layer is cached unless deps change.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---------- runner: minimal runtime image ----------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Railway/Render inject PORT at runtime; server.js reads process.env.PORT.
ENV PORT=5000

# Run as an unprivileged user.
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

COPY --from=deps /app/node_modules ./node_modules
COPY . .

USER nodejs
EXPOSE 5000

CMD ["node", "server.js"]
