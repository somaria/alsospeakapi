import { component$ } from '@builder.io/qwik';
import { routeLoader$, Form, routeAction$, zod$, z, Link } from '@builder.io/qwik-city';
import { verifySimpleMagicLinkToken } from '~/utils/simple-auth';

// Verify the token and create a session
export const useVerifyToken = routeLoader$(async ({ cookie, query, redirect }) => {
  const token = query.get('token');
  const redirectTo = query.get('redirectTo') || '/';
  
  if (!token) {
    return {
      success: false,
      message: 'No token provided',
    };
  }
  
  try {
    console.log('Verifying token:', token.substring(0, 20) + '...');
    
    // Verify the token without database dependency
    const result = verifySimpleMagicLinkToken(token);
    
    if (!result) {
      console.log('Token verification failed');
      return {
        success: false,
        message: 'Invalid or expired token',
      };
    }
    
    const { email } = result;
    console.log('Token verified for email:', email);
    
    // Create a simple auth cookie with the user's email
    const authData = {
      email,
      authenticated: true,
      lastLoginAt: new Date().toISOString(),
    };
    
    // Set the auth cookie
    cookie.set('auth', JSON.stringify(authData), {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    
    // Redirect to the requested page or home
    throw redirect(302, redirectTo);
  } catch (error) {
    if ((error as any).status === 302) {
      throw error; // Re-throw redirect
    }
    
    console.error('Error verifying token:', error);
    return {
      success: false,
      message: 'Error verifying token',
      error: error instanceof Error ? error.message : String(error),
    };
  }
});

// Action to handle manual verification form submission
export const useManualVerify = routeAction$(
  async ({ email }, { cookie, redirect }) => {
    // Create a simple auth cookie with the user's email
    const authData = {
      email,
      authenticated: true,
      lastLoginAt: new Date().toISOString(),
    };
    
    // Set the auth cookie
    cookie.set('auth', JSON.stringify(authData), {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    
    // Redirect to home
    throw redirect(302, '/');
  },
  zod$({
    email: z.string().email('Please enter a valid email address'),
  })
);

export default component$(() => {
  const verifyResult = useVerifyToken();
  const manualVerify = useManualVerify();
  
  return (
    <div class="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Verify Your Email
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            We're verifying your magic link...
          </p>
        </div>
        
        {verifyResult.value.success === false && (
          <div class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Verification Failed</h3>
                <div class="mt-2 text-sm text-red-700">
                  <p>{verifyResult.value.message}</p>
                  {verifyResult.value.error && (
                    <p class="mt-1 font-mono text-xs">{verifyResult.value.error}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {verifyResult.value.success === false && (
          <div class="mt-8">
            <div class="rounded-md bg-blue-50 p-4">
              <div class="flex">
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-blue-800">Manual Verification</h3>
                  <div class="mt-2 text-sm text-blue-700">
                    <p>If you're having trouble with the magic link, you can manually verify your email:</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Form action={manualVerify} class="mt-4 space-y-6">
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
              
              {manualVerify.value && manualVerify.value.fieldErrors?.email && (
                <div class="text-red-500 text-sm">{manualVerify.value.fieldErrors.email}</div>
              )}
              
              <div>
                <button
                  type="submit"
                  class="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Verify Email
                </button>
              </div>
            </Form>
            
            <div class="mt-6 text-center">
              <Link href="/auth/login" class="text-sm text-indigo-600 hover:text-indigo-500">
                Back to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
