# Multi-stage production build for Digital Card Specialist API
FROM docker.io/library/node:22-alpine AS builder

WORKDIR /app

# Install openssl for Prisma
RUN apk add --no-cache openssl

COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

# Generate Prisma Client and build NestJS + Seed script
RUN npx prisma generate
RUN npm run build

# Production runner stage
FROM docker.io/library/node:22-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV PATH="/app/node_modules/.bin:$PATH"

COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm install --omit=dev && npm cache clean --force

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/src/schema.gql ./src/schema.gql

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
