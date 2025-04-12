import { component$ } from '@builder.io/qwik';
import { routeLoader$, Form, routeAction$, zod$, z, Link } from '@builder.io/qwik-city';
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
      
      // Send the magic link email
      const emailSent = await sendSimpleMagicLinkEmail(
        email,
        token,
        redirectTo || '/'
      );
      
      if (!emailSent) {
        return {
          success: false,
          message: 'Failed to send magic link email',
        };
      }
      
      return {
        success: true,
        message: 'Magic link sent! Check your email.',
        email,
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
  const auth = useCheckAuth();
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
                <h3 class="text-sm font-medium text-green-800">Magic Link Sent</h3>
                <div class="mt-2 text-sm text-green-700">
                  <p>We've sent a magic link to {login.value.email}. Check your email to sign in.</p>
                  <p class="mt-1">If you don't see the email, check your spam folder.</p>
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
                class="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Send Magic Link
              </button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
});
