import { component$ } from '@builder.io/qwik';
import type { RequestHandler } from '@builder.io/qwik-city';
import { verifyToken } from '~/utils/auth';

export const onGet: RequestHandler = async ({ url, cookie, redirect }) => {
  const token = url.searchParams.get('token');
  if (!token) {
    throw redirect(302, '/signin?error=missing-token');
  }

  const verified = verifyToken(token);
  if (!verified) {
    throw redirect(302, '/signin?error=invalid-token');
  }

  // Set auth cookie
  const cookieValue = JSON.stringify({
    authenticated: true,
    email: verified.email,
  });

  cookie.set('auth', cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });

  throw redirect(302, '/dashboard');
};

export default component$(() => {
  return (
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verifying your login...
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Please wait while we verify your login credentials.
          </p>
        </div>
      </div>
    </div>
  );
});
