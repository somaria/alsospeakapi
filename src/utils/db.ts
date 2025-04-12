// Use dynamic import to handle both browser and server environments
let PrismaClient: any;
let prismaClientInstance: any = null;

// Check if we're in a Node.js environment
const isNode = typeof process !== 'undefined' && typeof process.versions === 'object';

// Function to create a new Prisma client instance
function createPrismaClient() {
  if (!PrismaClient) {
    console.error('PrismaClient class is not defined');
    return null;
  }
  
  try {
    return new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  } catch (error) {
    console.error('Error creating PrismaClient instance:', error);
    return null;
  }
}

// Initialize Prisma client
async function initializePrismaClient() {
  if (isNode) {
    try {
      // For server environment in CommonJS
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { PrismaClient: ServerPrismaClient } = require('@prisma/client');
      PrismaClient = ServerPrismaClient;
      console.log('Using server PrismaClient (CommonJS)');
      
      // Create and return a new instance
      return createPrismaClient();
    } catch (commonJsError) {
      console.log('CommonJS import failed, trying ESM import:', (commonJsError as Error).message);
      
      try {
        // For server environment in ESM
        const module = await import('@prisma/client');
        
        // In ESM, the module structure might be different
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ClientClass = (module as any).PrismaClient || ((module as any).default && (module as any).default.PrismaClient);
        
        if (ClientClass) {
          PrismaClient = ClientClass;
          console.log('Successfully loaded PrismaClient via ESM import');
          
          // Create and return a new instance
          return createPrismaClient();
        } else {
          console.error('PrismaClient not found in ESM module');
          return null;
        }
      } catch (esmError) {
        console.error('Failed to import PrismaClient (ESM):', esmError);
        return null;
      }
    }
  } else {
    // For browser environment, use the generated client or a dummy
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { PrismaClient: BrowserPrismaClient } = require('../generated/prisma');
      PrismaClient = BrowserPrismaClient;
      console.log('Using browser PrismaClient');
      
      // Create and return a new instance
      return createPrismaClient();
    } catch (e) {
      console.error('Failed to import browser PrismaClient:', e);
      
      // Create a dummy client for browser environments where Prisma isn't available
      PrismaClient = class DummyPrismaClient {
        constructor() {
          console.warn('Using dummy PrismaClient in browser environment');
        }
      };
      
      return new PrismaClient();
    }
  }
}

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: any };

// Get or initialize the Prisma client
export const prisma = globalForPrisma.prisma || (() => {
  if (prismaClientInstance) {
    return prismaClientInstance;
  }
  
  // Initialize synchronously first with a basic client
  if (isNode) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { PrismaClient: SyncPrismaClient } = require('@prisma/client');
      prismaClientInstance = new SyncPrismaClient({
        log: ['query', 'info', 'warn', 'error'],
      });
      console.log('Initialized PrismaClient synchronously');
    } catch (error) {
      console.error('Failed to initialize PrismaClient synchronously:', error);
      // Create a temporary client that will be replaced
      prismaClientInstance = {
        user: {
          findUnique: async () => null,
          create: async () => null,
          update: async () => null,
        }
      };
      
      // Try async initialization
      initializePrismaClient().then(client => {
        if (client) {
          prismaClientInstance = client;
          globalForPrisma.prisma = client;
          console.log('Replaced temporary client with real PrismaClient');
        }
      });
    }
  } else {
    // Browser environment - create a dummy client
    prismaClientInstance = {
      user: {
        findUnique: async () => null,
        create: async () => null,
        update: async () => null,
      }
    };
  }
  
  return prismaClientInstance;
})();

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

export async function updateUserVerification(id: string, emailVerified: boolean) {
  try {
    console.log(`Updating user verification status: ${id}, ${emailVerified}`);
    return await prisma.user.update({
      where: { id },
      data: { emailVerified },
    });
  } catch (error) {
    console.error('Error updating user verification:', error);
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
