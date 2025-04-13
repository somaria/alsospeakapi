import { component$ } from '@builder.io/qwik';
import { routeLoader$, Form, routeAction$, zod$, z } from '@builder.io/qwik-city';
import { createHash } from 'crypto';

// Standalone token generation function that doesn't rely on any imports
function generateToken(email: string): string {
  const timestamp = Date.now();
  const secretKey = process.env.AUTH_SECRET || 'alsospeak-language-learning-api-secret-key';
  console.log('Using secret key:', secretKey.substring(0, 3) + '...');
  
  const data = `${email}:${createHash('sha256').update(`${email}:${timestamp}:${secretKey}`).digest('hex')}:${timestamp}`;
  return Buffer.from(data).toString('base64');
}

// Standalone token verification function that doesn't rely on any imports
function verifyToken(token: string): { email: string } | null {
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
    const secretKey = process.env.AUTH_SECRET || 'alsospeak-language-learning-api-secret-key';
    console.log('Using secret key for verification:', secretKey.substring(0, 3) + '...');
    
    const expectedHash = createHash('sha256').update(`${email}:${timestamp}:${secretKey}`).digest('hex');
    if (hash !== expectedHash) {
      console.log('Invalid token hash');
      console.log('Expected hash:', expectedHash);
      console.log('Actual hash:', hash);
      return null;
    }
    
    return { email };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Get environment info
export const useEnvInfo = routeLoader$(async () => {
  // Get environment variables for debugging
  const envVars = {
    NODE_ENV: process.env.NODE_ENV || 'unknown',
    PUBLIC_HOST: process.env.PUBLIC_HOST || 'unknown',
    AUTH_SECRET: process.env.AUTH_SECRET ? '[present]' : '[missing]',
    DATABASE_URL: process.env.DATABASE_URL ? '[present]' : '[missing]',
  };
  
  return {
    envVars,
  };
});

// Action to generate a test token
export const useGenerateToken = routeAction$(
  async ({ email }) => {
    console.log('Generating token for:', email);
    
    try {
      // Generate a token
      const token = generateToken(email);
      console.log('Generated token:', token.substring(0, 20) + '...');
      
      // Create the magic link URL directly here for debugging
      const baseUrl = process.env.PUBLIC_HOST || 'http://localhost:3000';
      const magicLinkUrl = new URL('/debug/standalone/verify', baseUrl);
      magicLinkUrl.searchParams.set('token', token);
      
      // Log the magic link for debugging
      console.log('IMPORTANT - Magic link URL:', magicLinkUrl.toString());
      
      return {
        success: true,
        message: 'Token generated successfully',
        email,
        token,
        magicLink: magicLinkUrl.toString(),
      };
    } catch (error) {
      console.error('Token generation error:', error);
      return {
        success: false,
        message: 'Error generating token',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
  zod$({
    email: z.string().email('Please enter a valid email address'),
  })
);

// Action to verify a token
export const useVerifyToken = routeAction$(
  async ({ token }) => {
    console.log('Verifying token:', token.substring(0, 20) + '...');
    
    try {
      // Verify the token
      const result = verifyToken(token);
      
      if (!result) {
        return {
          success: false,
          message: 'Invalid or expired token',
        };
      }
      
      return {
        success: true,
        email: result.email,
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return {
        success: false,
        message: 'Error verifying token',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
  zod$({
    token: z.string().min(1, 'Token is required'),
  })
);

export default component$(() => {
  const envInfo = useEnvInfo();
  const generateToken = useGenerateToken();
  const verifyToken = useVerifyToken();
  
  return (
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Standalone Authentication Debug</h1>
      <p class="mb-4 text-gray-700">This page doesn't rely on any external imports or database connections.</p>
      
      <div class="bg-gray-100 p-4 rounded mb-6">
        <h2 class="text-xl font-semibold mb-2">Environment Variables</h2>
        <pre class="bg-gray-800 text-white p-3 rounded overflow-x-auto">
          {JSON.stringify(envInfo.value.envVars, null, 2)}
        </pre>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-gray-100 p-4 rounded">
          <h2 class="text-xl font-semibold mb-4">Generate Token</h2>
          <Form action={generateToken} class="space-y-4">
            <div>
              <label class="block mb-1">Email:</label>
              <input 
                type="email" 
                name="email" 
                class="w-full p-2 border rounded"
                placeholder="Enter your email"
              />
            </div>
            <button 
              type="submit" 
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Generate Token
            </button>
          </Form>
          
          {generateToken.value?.success && (
            <div class="mt-4 p-3 bg-green-100 rounded">
              <h3 class="font-semibold">Generated Token:</h3>
              <div class="mt-1">
                <textarea 
                  value={generateToken.value.token} 
                  readOnly
                  class="w-full p-2 border rounded text-sm font-mono h-20"
                />
              </div>
              
              <h3 class="font-semibold mt-3">Magic Link URL:</h3>
              <div class="mt-1">
                <textarea 
                  value={generateToken.value.magicLink} 
                  readOnly
                  class="w-full p-2 border rounded text-sm font-mono h-20"
                />
              </div>
              <a 
                href={generateToken.value.magicLink}
                class="inline-block mt-2 text-blue-500 hover:underline"
              >
                Open Magic Link
              </a>
            </div>
          )}
          
          {generateToken.value?.success === false && (
            <div class="mt-4 p-3 bg-red-100 rounded">
              <h3 class="font-semibold">Error:</h3>
              <p>{generateToken.value.message}</p>
              {generateToken.value.error && (
                <p class="mt-1 font-mono text-xs">{generateToken.value.error}</p>
              )}
            </div>
          )}
        </div>
        
        <div class="bg-gray-100 p-4 rounded">
          <h2 class="text-xl font-semibold mb-4">Verify Token</h2>
          <Form action={verifyToken} class="space-y-4">
            <div>
              <label class="block mb-1">Token:</label>
              <textarea 
                name="token" 
                class="w-full p-2 border rounded h-32 font-mono text-sm"
                placeholder="Paste token here"
              />
            </div>
            <button 
              type="submit" 
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Verify Token
            </button>
          </Form>
          
          {verifyToken.value?.success && (
            <div class="mt-4 p-3 bg-green-100 rounded">
              <h3 class="font-semibold">Token Valid!</h3>
              <p>Email: {verifyToken.value.email}</p>
            </div>
          )}
          
          {verifyToken.value?.success === false && (
            <div class="mt-4 p-3 bg-red-100 rounded">
              <h3 class="font-semibold">Token Invalid!</h3>
              <p>{verifyToken.value.message}</p>
              {verifyToken.value.error && (
                <p class="mt-1 font-mono text-xs">{verifyToken.value.error}</p>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div class="mt-6">
        <h2 class="text-xl font-semibold mb-2">Verify Token from URL</h2>
        <p>If you arrived here via a magic link, the token verification result will appear below:</p>
        
        <div id="urlVerificationResult" class="mt-2 p-3 bg-gray-100 rounded">
          <p>No token in URL</p>
        </div>
        
        <script dangerouslySetInnerHTML={`
          document.addEventListener('DOMContentLoaded', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            const resultDiv = document.getElementById('urlVerificationResult');
            
            if (token) {
              resultDiv.innerHTML = '<p>Token found in URL. Submit the form above to verify it.</p>';
              
              // Auto-fill the verification form
              const tokenTextarea = document.querySelector('textarea[name="token"]');
              if (tokenTextarea) {
                tokenTextarea.value = token;
              }
            }
          });
        `} />
      </div>
    </div>
  );
});
