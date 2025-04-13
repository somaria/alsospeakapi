import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { routeLoader$ } from '@builder.io/qwik-city';
import Nav from '~/components/navigation/nav';

export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 5,
  });
};

// Server-side auth check
export const useAuthCheck = routeLoader$(async ({ cookie }) => {
  const authCookie = cookie.get('auth');
  if (!authCookie) {
    return { isAuthenticated: false };
  }
  
  try {
    const auth = JSON.parse(authCookie.value);
    return { isAuthenticated: auth.authenticated };
  } catch (error) {
    console.error('Error parsing auth cookie:', error);
    return { isAuthenticated: false };
  }
});

export default component$(() => {
  const auth = useAuthCheck();
  
  return (
    <div class="min-h-screen flex flex-col">
      <Nav isAuthenticated={auth.value.isAuthenticated} />
      <main class="flex-grow container mx-auto px-4 py-8">
        <Slot />
      </main>
      <footer class="bg-gray-800 text-white py-6">
        <div class="container mx-auto px-4">
          <p class="text-center">{new Date().getFullYear()} AlsoSpeak. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
});
