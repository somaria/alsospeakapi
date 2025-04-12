FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install pnpm in the builder stage
RUN npm install -g pnpm

# Generate Prisma client
RUN npx prisma generate

# Build the application
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV SKIP_TYPECHECK=true
ENV SKIP_LINT=true
RUN pnpm run build
RUN pnpm run build.server

# Production image, copy all the files and run the server
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Install SQLite tools
RUN apk add --no-cache sqlite

# Create data directory for SQLite database
RUN mkdir -p /app/data

# Copy necessary files from the builder stage
COPY --from=builder /app/server ./server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Create and add entrypoint script
RUN echo '#!/bin/sh\nset -e\n\n# Ensure data directory exists and has correct permissions\necho "Setting up data directory..."\nmkdir -p /app/data\nchmod 777 /app/data\n\n# Check if database file exists and set permissions if it does\nif [ -f /app/data/alsospeakapi.db ]; then\n  echo "Setting permissions on existing database file..."\n  chmod 666 /app/data/alsospeakapi.db\nfi\n\n# Run Prisma migrations\necho "Running Prisma migrations..."\nnpx prisma migrate deploy\n\n# Run Prisma db push as a fallback (for SQLite)\necho "Running Prisma db push..."\nnpx prisma db push\n\n# Ensure the database file has correct permissions after migration\nif [ -f /app/data/alsospeakapi.db ]; then\n  echo "Setting permissions on database file after migration..."\n  chmod 666 /app/data/alsospeakapi.db\nfi\n\n# Start the application\necho "Starting the application..."\nexec "$@"' > ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Expose the port the app will run on
EXPOSE 3000

# Use the custom entrypoint script
ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "server/entry.express.js"]
