#!/bin/sh

# Create or update .env file with required variables
cat > .env << EOL
# Environment variables for Prisma
DATABASE_URL="file:/app/data/alsospeakapi.db"

# Authentication
AUTH_SECRET="${AUTH_SECRET:-default-auth-secret-change-this}"
PUBLIC_HOST="${PUBLIC_HOST:-https://alsospeakapi.fly.dev}"

# Email configuration
EMAIL_SERVER_HOST="${EMAIL_SERVER_HOST:-smtp.example.com}"
EMAIL_SERVER_PORT="${EMAIL_SERVER_PORT:-587}"
EMAIL_SERVER_USER="${EMAIL_SERVER_USER:-your-email-username}"
EMAIL_SERVER_PASSWORD="${EMAIL_SERVER_PASSWORD:-your-email-password}"
EMAIL_FROM="${EMAIL_FROM:-noreply@alsospeak.com}"
EOL

echo "Environment variables set up successfully."
