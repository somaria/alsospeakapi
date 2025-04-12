# AlsoSpeak Language Learning API

AlsoSpeak provides powerful APIs for language learning mobile applications. Our platform enables developers to build exceptional language learning experiences with comprehensive translation, speech, vocabulary, and grammar analysis tools.

## Project Overview

This is a Qwik-based web application that serves as the management platform and documentation for the AlsoSpeak Language Learning API. The platform provides authentication, API key management, and comprehensive documentation for mobile app developers.

## Features

- **Authentication**: Magic link-based authentication system
- **API Key Management**: Create and manage API keys for your mobile applications
- **Documentation**: Comprehensive API documentation with examples
- **Analytics Dashboard**: Monitor API usage and performance
- **User Management**: Manage users and permissions

## Technology Stack

- **Frontend**: Qwik framework with TypeScript
- **Backend**: Express.js
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS
- **Deployment**: Fly.io

## API Capabilities

AlsoSpeak API provides the following language learning capabilities:

- **Translation API**: Context-aware translation across 100+ languages
- **Text-to-Speech & Speech-to-Text**: Voice APIs with native accents and pronunciation assessment
- **Vocabulary Management**: Comprehensive word databases with definitions and examples
- **Grammar Analysis**: Grammar checking and explanation
- **Learning Enhancement**: Flashcard generation, difficulty assessment, and exercise creation

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/alsospeakapi.git
   cd alsospeakapi
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="file:./data.db?connection_limit=1"
   AUTH_SECRET="your-secret-key"
   PUBLIC_HOST="http://localhost:5173"
   
   # Email configuration
   EMAIL_SERVER_HOST="smtp.example.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="your-email@example.com"
   EMAIL_SERVER_PASSWORD="your-password"
   EMAIL_FROM="noreply@example.com"
   ```

4. Initialize the database:
   ```bash
   pnpm prisma migrate dev
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

## Development

### Project Structure

- `/src`: Source code
  - `/routes`: Application routes
  - `/components`: Reusable components
  - `/utils`: Utility functions
  - `/server`: Server-side code
- `/prisma`: Database schema and migrations
- `/public`: Static assets

### Available Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm preview`: Preview production build
- `pnpm test`: Run tests
- `pnpm prisma studio`: Open Prisma Studio to manage database

## Deployment

The application is deployed on Fly.io. To deploy your own instance:

1. Install the Fly CLI:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. Log in to Fly:
   ```bash
   fly auth login
   ```

3. Launch the app:
   ```bash
   fly launch
   ```

4. Set secrets:
   ```bash
   fly secrets set DATABASE_URL="file:./data.db?connection_limit=1" \
     AUTH_SECRET="your-secret-key" \
     PUBLIC_HOST="https://your-app.fly.dev" \
     EMAIL_SERVER_HOST="smtp.example.com" \
     EMAIL_SERVER_PORT=587 \
     EMAIL_SERVER_USER="your-email@example.com" \
     EMAIL_SERVER_PASSWORD="your-password" \
     EMAIL_FROM="noreply@example.com"
   ```

5. Deploy:
   ```bash
   fly deploy
   ```

## Current Deployment

The application is currently deployed at: https://alsospeakapi.fly.dev/

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Express Server

This app has a minimal [Express server](https://expressjs.com/) implementation. After running a full build, you can preview the build using the command:

```
pnpm serve
```

Then visit [http://localhost:8080/](http://localhost:8080/)
