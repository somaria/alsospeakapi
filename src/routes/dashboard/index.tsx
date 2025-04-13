import { component$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';

// Protected route loader
export const useAuthCheck = routeLoader$(async ({ cookie, redirect }) => {
  const authCookie = cookie.get('auth');
  if (!authCookie) {
    throw redirect(302, '/signin');
  }
  
  try {
    const auth = JSON.parse(authCookie.value);
    if (!auth.authenticated) {
      throw redirect(302, '/signin');
    }
    return auth;
  } catch (error) {
    throw redirect(302, '/signin');
  }
});

export default component$(() => {
  const auth = useAuthCheck();
  
  return (
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-lg shadow p-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-6">
            AlsoSpeak Language Learning API Dashboard
          </h1>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* API Usage Card */}
            <div class="bg-indigo-50 rounded-lg p-6">
              <h2 class="text-lg font-semibold text-indigo-900 mb-2">API Usage</h2>
              <p class="text-indigo-700">Monitor your API usage and quotas</p>
              <div class="mt-4">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm text-indigo-600">Requests Today</span>
                  <span class="font-semibold text-indigo-900">0</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-indigo-600">Monthly Quota</span>
                  <span class="font-semibold text-indigo-900">10,000</span>
                </div>
              </div>
            </div>
            
            {/* Language Services Card */}
            <div class="bg-emerald-50 rounded-lg p-6">
              <h2 class="text-lg font-semibold text-emerald-900 mb-2">Language Services</h2>
              <p class="text-emerald-700">Available language learning features</p>
              <ul class="mt-4 space-y-2">
                <li class="flex items-center text-sm text-emerald-600">
                  <span class="mr-2">✓</span> Translation API
                </li>
                <li class="flex items-center text-sm text-emerald-600">
                  <span class="mr-2">✓</span> Text-to-Speech
                </li>
                <li class="flex items-center text-sm text-emerald-600">
                  <span class="mr-2">✓</span> Vocabulary Management
                </li>
              </ul>
            </div>
            
            {/* Account Info Card */}
            <div class="bg-sky-50 rounded-lg p-6">
              <h2 class="text-lg font-semibold text-sky-900 mb-2">Account Info</h2>
              <div class="mt-4 space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-sky-600">Email</span>
                  <span class="font-semibold text-sky-900">{auth.value.email}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-sky-600">Plan</span>
                  <span class="font-semibold text-sky-900">Free Tier</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* API Keys Section */}
          <div class="mt-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">API Keys</h2>
            <div class="bg-gray-50 rounded-lg p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Your API Key</p>
                  <p class="font-mono text-sm mt-1">••••••••••••••••</p>
                </div>
                <button class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Generate New Key
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Dashboard - AlsoSpeak Language Learning API',
  meta: [
    {
      name: 'description',
      content: 'Access your AlsoSpeak Language Learning API dashboard to monitor usage, manage API keys, and configure language services.',
    },
  ],
};
