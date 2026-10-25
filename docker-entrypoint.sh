#!/bin/sh
set -e

echo "Applying PostgreSQL schema migrations..."
npx prisma migrate deploy

echo "Ensuring candidate seed data exists..."
npx ts-node -T prisma/seed.ts || echo "Seed already applied or skipped."

echo "Starting NestJS Production Server..."
exec node dist/src/main.js
