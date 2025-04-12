#!/bin/sh
set -e

# Ensure data directory exists and has correct permissions
echo "Setting up data directory..."
mkdir -p /app/data
chmod 777 /app/data

# Check if database file exists and set permissions if it does
if [ -f /app/data/alsospeakapi.db ]; then
  echo "Setting permissions on existing database file..."
  chmod 666 /app/data/alsospeakapi.db
fi

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Run Prisma db push as a fallback (for SQLite)
echo "Running Prisma db push..."
npx prisma db push

# Ensure the database file has correct permissions after migration
if [ -f /app/data/alsospeakapi.db ]; then
  echo "Setting permissions on database file after migration..."
  chmod 666 /app/data/alsospeakapi.db
fi

# Start the application
echo "Starting the application..."
exec "$@"
