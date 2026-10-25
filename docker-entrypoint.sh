#!/bin/sh
set -e

echo "Applying PostgreSQL schema migrations (prisma migrate deploy)..."
npx prisma migrate deploy

echo "Running database seed (prisma db seed)..."
npx prisma db seed

echo "Starting NestJS Production Server..."
exec node dist/src/main.js
