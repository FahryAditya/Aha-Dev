# -------------------------------------------------------------
# Stage 1: Builder
# -------------------------------------------------------------
FROM node:22-slim AS builder

WORKDIR /app

# Install OpenSSL & CA certificates needed by Prisma and TLS
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy package manifests & prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (including devDependencies for build)
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy source code & TypeScript configuration
COPY tsconfig.json ./
COPY src ./src/

# Compile TypeScript to dist/
RUN npm run build

# Prune devDependencies to keep image lean
RUN npm prune --omit=dev

# -------------------------------------------------------------
# Stage 2: Production Runner
# -------------------------------------------------------------
FROM node:22-slim AS runner

WORKDIR /app

# Install OpenSSL & CA certificates for PostgreSQL SSL & Discord Gateway TLS
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

# Run with non-root node user for container security
USER node

# Copy production artifacts from builder
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/prisma ./prisma

# Healthcheck or direct execution
CMD ["node", "dist/index.js"]
