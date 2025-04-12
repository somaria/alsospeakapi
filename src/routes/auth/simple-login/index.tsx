import { component$ } from '@builder.io/qwik';
import { routeLoader$, Form, routeAction$, zod$, z } from '@builder.io/qwik-city';
import { generateSimpleMagicLinkToken, sendSimpleMagicLinkEmail } from '~/utils/simple-auth';

// Check if the user is already logged in
export const useCheckAuth = routeLoader$(async ({ cookie, redirect }) => {
  const authCookie = cookie.get('auth')?.value;
  
  if (authCookie) {
    try {
      const authData = JSON.parse(authCookie);
      if (authData.authenticated) {
        throw redirect(302, '/');
      }
    } catch (e) {
      // Invalid cookie, continue with login
      if ((e as any).status === 302) {
        throw e; // Re-throw redirect
      }
    }
  }
  
  return {
    isAuthenticated: false,
  };
});

// Action to handle login form submission
export const useLogin = routeAction$(
  async ({ email, redirectTo }) => {
    console.log('Login attempt for:', email);
    
    try {
      // Generate a magic link token
      const token = generateSimpleMagicLinkToken(email);
      console.log('Generated token:', token.substring(0, 20) + '...');
      
      // Create the magic link URL directly here for debugging
      const baseUrl = process.env.PUBLIC_HOST || 'http://localhost:3000';
      const magicLinkUrl = new URL('/auth/simple-verify', baseUrl);
      magicLinkUrl.searchParams.set('token', token);
      if (redirectTo) {
        magicLinkUrl.searchParams.set('redirectTo', redirectTo);
      }
      
      // Log the magic link for debugging
      console.log('IMPORTANT - Magic link URL:', magicLinkUrl.toString());
      
      // Try to send the email, but don't rely on it for testing
      try {
        await sendSimpleMagicLinkEmail(
          email,
          token,
          redirectTo || '/'
        );
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Continue even if email fails
      }
      
      return {
        success: true,
        message: 'Magic link generated! Check the server logs for the link.',
        email,
        // Include the magic link in the response for testing
        magicLink: magicLinkUrl.toString(),
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
  zod$({
    email: z.string().email('Please enter a valid email address'),
    redirectTo: z.string().optional(),
  })
);

export default component$(() => {
  // We're not using auth here but keeping the loader for future use
  useCheckAuth();
  const login = useLogin();
  
  return (
    <div class="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to AlsoSpeak
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            The language learning API platform
          </p>
        </div>
        
        {login.value?.success && (
          <div class="rounded-md bg-green-50 p-4">
            <div class="flex">
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800">Magic Link Generated</h3>
                <div class="mt-2 text-sm text-green-700">
                  <p>We've attempted to send a magic link to {login.value.email}.</p>
                  <p class="mt-1">For testing purposes, you can use the link below:</p>
                  <a 
                    href={login.value.magicLink} 
                    class="mt-2 inline-block text-blue-600 underline break-all"
                    target="_blank"
                  >
                    {login.value.magicLink}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {login.value?.success === false && (
          <div class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Login Failed</h3>
                <div class="mt-2 text-sm text-red-700">
                  <p>{login.value.message}</p>
                  {login.value.error && (
                    <p class="mt-1 font-mono text-xs">{login.value.error}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!login.value?.success && (
          <Form action={login} class="mt-8 space-y-6">
            <input type="hidden" name="redirectTo" value="/" />
            <div class="-space-y-px rounded-md shadow-sm">
              <div>
                <label for="email" class="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  class="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Email address"
                />
              </div>
            </div>
            
            {login.value?.fieldErrors?.email && (
              <div class="text-red-500 text-sm">{login.value.fieldErrors.email}</div>
            )}
            
            <div>
              <button
                type="submit"
                class="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Generate Magic Link
              </button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
});
