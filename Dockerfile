# syntax=docker/dockerfile:1.4

FROM node:18-bookworm-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:18-bookworm-slim AS runtime
ENV NODE_ENV=production
ENV PORT=3000
ENV USE_MEMORY_DB=true
WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY backend/ ./
COPY --from=frontend-build /app/frontend/build ./public

EXPOSE 3000
CMD ["npm", "start"]
