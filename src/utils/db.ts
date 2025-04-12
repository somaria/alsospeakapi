// Use dynamic import to handle both browser and server environments
let PrismaClient: any;

// Check if we're in a Node.js environment
const isNode = typeof process !== 'undefined' && typeof process.versions === 'object';

if (isNode) {
  try {
    // For server environment in CommonJS
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaClient: ServerPrismaClient } = require('@prisma/client');
    PrismaClient = ServerPrismaClient;
    console.log('Using server PrismaClient (CommonJS)');
  } catch (error) {
    try {
      // For server environment in ESM
      // We need to use dynamic import for ESM compatibility
      console.log('Attempting to use ESM import for PrismaClient');
      
      // Temporary class until the import completes
      PrismaClient = class TemporaryPrismaClient {
        constructor() {
          console.log('Initializing temporary PrismaClient while ESM import completes');
        }
      };
      
      // This will be executed asynchronously
      import('@prisma/client').then(module => {
        // In ESM, the module structure might be different
        // @ts-ignore - TypeScript doesn't know the structure of the dynamically imported module
        const ClientClass = module.PrismaClient || (module.default && module.default.PrismaClient);
        if (ClientClass) {
          PrismaClient = ClientClass;
          console.log('Successfully loaded PrismaClient via ESM import');
          
          // Initialize Prisma client after dynamic import
          const globalForPrisma = global as unknown as { prisma: any };
          if (!globalForPrisma.prisma) {
            globalForPrisma.prisma = new PrismaClient({
              log: ['query', 'info', 'warn', 'error'],
            });
          }
        } else {
          console.error('PrismaClient not found in ESM module');
        }
      }).catch(e => {
        console.error('Failed to import PrismaClient (ESM):', e);
      });
    } catch (e) {
      console.error('Failed to import PrismaClient:', e);
    }
  }
} else {
  // For browser environment, use the generated client or a dummy
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaClient: BrowserPrismaClient } = require('../generated/prisma');
    PrismaClient = BrowserPrismaClient;
    console.log('Using browser PrismaClient');
  } catch (e) {
    console.error('Failed to import browser PrismaClient:', e);
    // Create a dummy client for browser environments where Prisma isn't available
    PrismaClient = class DummyPrismaClient {
      constructor() {
        console.warn('Using dummy PrismaClient in browser environment');
      }
    };
  }
}

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: any };

// Initialize Prisma client
export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// User-related database operations
export async function findUserByEmail(email: string) {
  try {
    console.log(`Looking up user with email: ${email}`);
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
}

export async function createUser(email: string) {
  try {
    console.log(`Creating new user with email: ${email}`);
    return await prisma.user.create({
      data: {
        email,
        emailVerified: false,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUserLastLogin(email: string) {
  try {
    console.log(`Updating last login for user with email: ${email}`);
    return await prisma.user.update({
      where: { email },
      data: {
        lastLoginAt: new Date(),
        emailVerified: true,
      },
    });
  } catch (error) {
    console.error('Error updating user last login:', error);
    throw error;
  }
}

export async function findOrCreateUser(email: string) {
  try {
    console.log(`Finding or creating user with email: ${email}`);
    const user = await findUserByEmail(email);
    
    if (user) {
      console.log(`User found: ${user.id}`);
      return user;
    }
    
    console.log('User not found, creating new user');
    return await createUser(email);
  } catch (error) {
    console.error('Error in findOrCreateUser:', error);
    throw error;
  }
}

export async function saveUsedToken(token: string, email: string) {
  try {
    console.log(`Saving used token for email: ${email}`);
    return await prisma.usedToken.create({
      data: {
        token,
        email,
      },
    });
  } catch (error) {
    console.error('Error saving used token:', error);
    throw error;
  }
}

export async function isTokenUsed(token: string) {
  try {
    console.log(`Checking if token is used: ${token.substring(0, 10)}...`);
    const usedToken = await prisma.usedToken.findUnique({
      where: { token },
    });
    return !!usedToken;
  } catch (error) {
    console.error('Error checking if token is used:', error);
    throw error;
  }
}

export async function createSession(userId: string, sessionToken: string, expires: Date) {
  try {
    console.log(`Creating session for user: ${userId}`);
    return await prisma.session.create({
      data: {
        sessionToken,
        userId,
        expires,
      },
    });
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}
