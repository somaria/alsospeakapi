import { component$, useSignal, $, type Signal } from '@builder.io/qwik'; 
import { routeLoader$, Form, routeAction$, type DocumentHead } from '@builder.io/qwik-city';
import { verifyToken, generateMagicLinkToken } from '~/utils/auth';

// Debug route to test token generation and verification
export const useDebugAuth = routeLoader$(async ({ cookie }) => {
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
  // Check if email exists and is a string
  if (typeof email !== 'string' || !email) { 
    return {
      success: false,
      message: 'Email is required and must be a string',
    };
  }
  
  // Now TypeScript knows 'email' is a string here
  const token = generateMagicLinkToken(email); 
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
  // Ensure token is a string and not empty
  if (typeof token !== 'string' || !token) {
    return {
      success: false,
      message: 'Token is missing or invalid',
    };
  }
  
  try {
    console.log('Debug verify token:', token);
    const decoded = await verifyToken(token); // Pass validated string token
    
    if (!decoded) {
      return {
        success: false,
        message: 'Invalid or expired token',
        tokenInfo: {
          length: token.length, // Safe now because token is a string
          prefix: token.substring(0, 20) + '...', // Safe now
        },
      };
    }
    
    // Token is valid
    return {
      success: true,
      email: decoded.email,
      tokenInfo: {
        length: token.length, // Safe now
        prefix: token.substring(0, 20) + '...', // Safe now
      },
    };
  } catch (error) {
    console.error('Token verification error:', error);
    // Ensure token is checked again for safety before using length/substring
    const safeTokenInfo = typeof token === 'string' && token 
      ? { length: token.length, prefix: token.substring(0, 20) + '...' } 
      : { length: 0, prefix: 'Invalid token' };
    return {
      success: false,
      message: 'Error verifying token',
      error: error instanceof Error ? error.message : String(error),
      tokenInfo: safeTokenInfo,
    };
  }
});

export default component$(() => {
  const debugData = useDebugAuth();
  const generateAction = useGenerateToken();
  const verifyAction = useVerifyToken(); // Corrected usage

  const email = useSignal('test@example.com');
  const token = useSignal('');
  
  // Signals for copying
  const copiedToken = useSignal(false);
  const copiedLink = useSignal(false);

  // Function to copy text to clipboard
  const copyToClipboard = $((text: string | undefined | null, signal: Signal<boolean>) => {
    if (typeof text === 'string' && text.length > 0) { // Check type and length
      navigator.clipboard.writeText(text);
      signal.value = true;
      setTimeout(() => {
        signal.value = false;
      }, 1500);
    } else {
      console.error('Attempted to copy invalid text:', text);
    }
  });
  
  return (
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Authentication Debug</h1>
      
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
                  onClick$={async () => {
                    // Ensure value exists and is a string before copying
                    copyToClipboard(generateAction.value?.token, copiedToken);
                  }}
                  class="ml-2 px-3 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300">
                  {copiedToken.value ? 'Copied!' : 'Copy'}
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
                  onClick$={async () => {
                     // Ensure value exists and is a string before copying
                    copyToClipboard(generateAction.value?.magicLinkUrl, copiedLink);
                  }}
                  class="ml-2 px-3 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300">
                  {copiedLink.value ? 'Copied!' : 'Copy'}
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
  title: 'Auth Debug - AlsoSpeak',
  meta: [
    {
      name: 'description',
      content: 'Debug authentication for AlsoSpeak',
    },
  ],
};
