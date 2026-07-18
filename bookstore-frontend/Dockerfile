# syntax=docker/dockerfile:1

# ---------- build the static site ----------
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Vite inlines env vars at BUILD time, so they must be passed as build args
# (NOT runtime env). On Railway/any Docker host, set these as build variables.
ARG VITE_API_URL
ARG VITE_STRIPE_PUBLIC_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_STRIPE_PUBLIC_KEY=$VITE_STRIPE_PUBLIC_KEY

COPY . .
RUN npm run build

# ---------- serve with nginx ----------
FROM nginx:alpine AS runner
# SPA fallback + dynamic port. nginx:alpine runs envsubst over files in
# /etc/nginx/templates/*.template at startup, so ${PORT} is filled from env.
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

# Default port for local runs; Railway/Render inject their own PORT.
ENV PORT=8080
EXPOSE 8080
