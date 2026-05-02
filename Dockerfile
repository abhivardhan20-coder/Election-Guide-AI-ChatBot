# Stage 1: Build Frontend
FROM node:18-alpine AS build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
# Inject build-time variables if needed, otherwise rely on server-side injection
RUN npm run build

# Stage 2: Production Server
FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app

# Use non-root user for better security
USER node

# Copy server files
COPY --chown=node:node server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --only=production
COPY --chown=node:node server/ ./

# Copy built frontend from Stage 1
COPY --from=build --chown=node:node /app/client/dist /app/client/dist

# Expose port (Cloud Run sets PORT env var automatically)
EXPOSE 8080

# Start server
CMD ["node", "index.js"]
