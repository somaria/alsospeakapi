import { component$, useSignal, $ } from '@builder.io/qwik';
import { routeLoader$, Form, routeAction$, type DocumentHead } from '@builder.io/qwik-city';
import { createHash } from 'crypto';

// Simple token generation without database dependency
function generateSimpleToken(email: string, secret: string): string {
  const timestamp = Date.now();
  const data = `${email}:${createHash('sha256').update(`${email}:${timestamp}:${secret}`).digest('hex')}:${timestamp}`;
  return Buffer.from(data).toString('base64');
}

// Simple token verification without database dependency
function verifySimpleToken(token: string, secret: string): { email: string } | null {
  try {
    const data = Buffer.from(token, 'base64').toString();
    const [email, hash, timestamp] = data.split(':');
    
    // Check if token is expired (1 hour)
    const tokenTime = parseInt(timestamp);
    const currentTime = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    if (currentTime - tokenTime > oneHour) {
      console.log('Token expired');
      return null; // Token expired
    }
    
    // Verify the hash
    const expectedHash = createHash('sha256').update(`${email}:${timestamp}:${secret}`).digest('hex');
    if (hash !== expectedHash) {
      console.log('Invalid token hash');
      return null;
    }
    
    return { email };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Debug route to test token generation and verification
export const useDebugAuth = routeLoader$(async ({ cookie }) => {
  // Get the current auth cookie if it exists
  const authCookie = cookie.get('auth')?.value;
  let authData = null;
  
  if (authCookie) {
    try {
      authData = JSON.parse(authCookie);
    } catch (e) {
      console.error('Failed to parse auth cookie:', e);
    }
  }
  
  // Get environment variables for debugging
  const envVars = {
    NODE_ENV: process.env.NODE_ENV || 'unknown',
    PUBLIC_HOST: process.env.PUBLIC_HOST || 'unknown',
    AUTH_SECRET: process.env.AUTH_SECRET ? '[present]' : '[missing]',
    DATABASE_URL: process.env.DATABASE_URL ? '[present]' : '[missing]',
  };
  
  return {
    authData,
    envVars,
  };
});

// Action to generate a test token
export const useGenerateToken = routeAction$(async ({ email }) => {
  // Validate inputs
  if (typeof email !== 'string' || !email) {
    return {
      success: false,
      message: 'Email is required and must be a string',
    };
  }
  
  const secret = process.env.AUTH_SECRET || 'alsospeak-language-learning-api-secret-key';
  console.log('Using secret for token generation:', secret.substring(0, 3) + '...');
  
  const token = generateSimpleToken(email, secret);
  const baseUrl = process.env.PUBLIC_HOST || 'http://localhost:3000';
  const magicLinkUrl = new URL('/auth/verify', baseUrl);
  magicLinkUrl.searchParams.set('token', token);
  
  return {
    success: true,
    token,
    magicLinkUrl: magicLinkUrl.toString(),
  };
});

// Action to verify a token
export const useVerifyToken = routeAction$(async ({ token }) => {
  // Validate inputs
  if (typeof token !== 'string' || !token) {
    return {
      success: false,
      message: 'Token is required and must be a string',
      tokenInfo: { length: 0, prefix: 'Invalid token type' } // Provide default info
    };
  }
  
  const secret = process.env.AUTH_SECRET || 'alsospeak-language-learning-api-secret-key';
  console.log('Using secret for token verification:', secret.substring(0, 3) + '...');
  
  console.log('Debug verify token:', token.substring(0, 20) + '...');
  
  try {
    const decoded = verifySimpleToken(token, secret);
    
    if (!decoded) {
      return {
        success: false,
        message: 'Invalid or expired token',
        tokenInfo: {
          length: token.length,
          prefix: token.substring(0, 20) + '...',
        },
      };
    }
    
    return {
      success: true,
      email: decoded.email,
      tokenInfo: {
        length: token.length,
        prefix: token.substring(0, 20) + '...',
      },
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return {
      success: false,
      message: 'Error verifying token',
      error: error instanceof Error ? error.message : String(error),
      tokenInfo: {
        length: token.length,
        prefix: token.substring(0, 20) + '...',
      },
    };
  }
});

export default component$(() => {
  const debugData = useDebugAuth();
  const generateAction = useGenerateToken();
  const verifyAction = useVerifyToken();
  
  const email = useSignal('test@example.com');
  const token = useSignal('');
  
  const copyToClipboard = $((text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  });
  
  return (
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Simple Authentication Debug</h1>
      <p class="mb-4 text-gray-700">This page uses a simplified authentication system that doesn't rely on the database.</p>
      
      <div class="bg-gray-100 p-4 rounded mb-6">
        <h2 class="text-xl font-semibold mb-2">Environment Variables</h2>
        <pre class="bg-gray-800 text-white p-3 rounded overflow-x-auto">
          {JSON.stringify(debugData.value.envVars, null, 2)}
        </pre>
      </div>
      
      <div class="bg-gray-100 p-4 rounded mb-6">
        <h2 class="text-xl font-semibold mb-2">Current Auth Cookie</h2>
        <pre class="bg-gray-800 text-white p-3 rounded overflow-x-auto">
          {debugData.value.authData ? JSON.stringify(debugData.value.authData, null, 2) : 'No auth cookie found'}
        </pre>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-gray-100 p-4 rounded">
          <h2 class="text-xl font-semibold mb-4">Generate Test Token</h2>
          <Form action={generateAction} class="space-y-4">
            <div>
              <label class="block mb-1">Email:</label>
              <input 
                type="email" 
                name="email" 
                value={email.value}
                onInput$={(e: any) => email.value = e.target.value}
                class="w-full p-2 border rounded"
              />
            </div>
            <button 
              type="submit" 
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Generate Token
            </button>
          </Form>
          
          {generateAction.value?.success && (
            <div class="mt-4 p-3 bg-green-100 rounded">
              <h3 class="font-semibold">Generated Token:</h3>
              <div class="flex items-center mt-1">
                <input 
                  type="text" 
                  value={generateAction.value.token} 
                  readOnly
                  class="w-full p-2 border rounded text-sm font-mono"
                />
                <button 
                  onClick$={() => copyToClipboard(generateAction.value?.token || '')}
                  class="ml-2 bg-gray-200 p-2 rounded"
                >
                  Copy
                </button>
              </div>
              
              <h3 class="font-semibold mt-3">Magic Link URL:</h3>
              <div class="flex items-center mt-1">
                <input 
                  type="text" 
                  value={generateAction.value.magicLinkUrl} 
                  readOnly
                  class="w-full p-2 border rounded text-sm font-mono"
                />
                <button 
                  onClick$={() => copyToClipboard(generateAction.value?.magicLinkUrl || '')}
                  class="ml-2 bg-gray-200 p-2 rounded"
                >
                  Copy
                </button>
              </div>
              <a 
                href={generateAction.value.magicLinkUrl}
                target="_blank"
                class="inline-block mt-2 text-blue-500 hover:underline"
              >
                Open Magic Link
              </a>
            </div>
          )}
        </div>
        
        <div class="bg-gray-100 p-4 rounded">
          <h2 class="text-xl font-semibold mb-4">Verify Token</h2>
          <Form action={verifyAction} class="space-y-4">
            <div>
              <label class="block mb-1">Token:</label>
              <textarea 
                name="token" 
                value={token.value}
                onInput$={(e: any) => token.value = e.target.value}
                class="w-full p-2 border rounded h-32 font-mono text-sm"
              />
            </div>
            <button 
              type="submit" 
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Verify Token
            </button>
          </Form>
          
          {verifyAction.value && (
            <div class={`mt-4 p-3 rounded ${verifyAction.value.success ? 'bg-green-100' : 'bg-red-100'}`}>
              <h3 class="font-semibold">
                {verifyAction.value.success ? 'Token Valid!' : 'Token Invalid!'}
              </h3>
              <pre class="bg-gray-800 text-white p-3 rounded overflow-x-auto mt-2 text-sm">
                {JSON.stringify(verifyAction.value, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Simple Auth Debug - AlsoSpeak',
  meta: [
    {
      name: 'description',
      content: 'Simple authentication debugging for AlsoSpeak Language Learning API',
    },
  ],
};
