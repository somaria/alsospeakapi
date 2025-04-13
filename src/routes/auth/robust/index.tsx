import { component$, useSignal } from '@builder.io/qwik';
import { routeLoader$, Form, routeAction$, zod$, z } from '@builder.io/qwik-city';
import { createHash } from 'crypto';

// Robust token generation function that uses a fixed secret key
function generateToken(email: string): string {
  // Use the same secret key as token verification
  const secretKey = process.env.AUTH_SECRET || 'default-secret-key';

  const timestamp = Date.now();
  console.log('Generating token with timestamp:', timestamp);
  console.log('Using fixed secret key for generation');

  // Create the hash with email, timestamp, and secret key
  const hash = createHash('sha256')
    .update(`${email}:${timestamp}:${secretKey}`)
    .digest('hex');

  // Create the token data
  const data = `${email}:${hash}:${timestamp}`;

  // Base64 encode the token data
  return Buffer.from(data).toString('base64');
}

// Get environment info
export const useEnvInfo = routeLoader$(async () => {
  // Get environment variables for debugging
  const envVars = {
    NODE_ENV: process.env.NODE_ENV || 'unknown',
    PUBLIC_HOST: process.env.PUBLIC_HOST || 'unknown',
    AUTH_SECRET: process.env.AUTH_SECRET ? '[present]' : '[missing]',
  };

  return {
    envVars,
    serverTime: new Date().toISOString(),
    timestamp: Date.now(),
  };
});

// Action to generate a test token
export const useGenerateToken = routeAction$(
  async ({ email }) => {
    console.log('Generating token for:', email);

    try {
      // Generate a token
      const token = generateToken(email);
      console.log('Generated token:', token);

      // Create the magic link URL
      const baseUrl = process.env.PUBLIC_HOST || 'https://alsospeakapi.fly.dev';
      const magicLinkUrl = new URL('/auth/robust/verify', baseUrl);
      magicLinkUrl.searchParams.set('token', token);
      magicLinkUrl.searchParams.set('redirectTo', '/');

      // Log the magic link for debugging
      console.log('Magic link URL:', magicLinkUrl.toString());

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

export default component$(() => {
  const envInfo = useEnvInfo();
  const generateToken = useGenerateToken();
  const showToken = useSignal(false);

  return (
    <div class="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            AlsoSpeak Language Learning API
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Sign in to access language learning features
          </p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="mb-4">
            <h3 class="text-lg font-medium">Environment Info</h3>
            <pre class="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
              {JSON.stringify(envInfo.value, null, 2)}
            </pre>
          </div>

          <Form action={generateToken} class="space-y-6">
            <div>
              <label
                for="email"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div class="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Generate Magic Link
              </button>
            </div>
          </Form>

          {generateToken.value?.success && (
            <div class="mt-6">
              <div class="rounded-md bg-green-50 p-4">
                <div class="flex">
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-green-800">
                      Magic Link Generated
                    </h3>
                    <div class="mt-2 text-sm text-green-700">
                      <p>Email: {generateToken.value.email}</p>
                      <div class="mt-2">
                        <button
                          onClick$={() => (showToken.value = !showToken.value)}
                          class="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          {showToken.value ? 'Hide' : 'Show'} Token
                        </button>
                        {showToken.value && (
                          <pre class="mt-2 p-2 bg-gray-100 rounded overflow-auto text-xs">
                            {generateToken.value.token}
                          </pre>
                        )}
                      </div>
                      <div class="mt-4">
                        <a
                          href={generateToken.value.magicLink}
                          class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Open Magic Link
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {generateToken.value?.success === false && (
            <div class="mt-6">
              <div class="rounded-md bg-red-50 p-4">
                <div class="flex">
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">Error</h3>
                    <div class="mt-2 text-sm text-red-700">
                      <p>{generateToken.value.message}</p>
                      {generateToken.value.error && (
                        <p class="mt-1 font-mono text-xs">
                          {generateToken.value.error}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
