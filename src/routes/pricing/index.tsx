import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">API Pricing Plans</h1>
      
      <p class="text-gray-700 mb-8">
        Choose the right API plan for your language learning application needs. All plans include access to our core language learning API endpoints.
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Basic Plan */}
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="bg-indigo-50 p-6">
            <h2 class="text-xl font-bold text-center">Basic</h2>
            <p class="text-4xl font-bold text-center mt-2">$49<span class="text-lg font-normal">/month</span></p>
          </div>
          <div class="p-6">
            <ul class="space-y-3">
              <li class="flex items-start">
                <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>100,000 API calls/month</span>
              </li>
              <li class="flex items-start">
                <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Access to 20 languages</span>
              </li>
              <li class="flex items-start">
                <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Basic translation API</span>
              </li>
              <li class="flex items-start">
                <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Vocabulary endpoints</span>
              </li>
              <li class="flex items-start">
                <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Email support</span>
              </li>
            </ul>
            <button class="w-full mt-6 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md">
              Get Started
            </button>
          </div>
        </div>
        
        {/* Pro Plan */}
        <div class="bg-white rounded-lg shadow-md overflow-hidden border-2 border-indigo-500 transform scale-105">
          <div class="bg-indigo-600 p-6 text-white">
            <div class="text-xs uppercase font-bold tracking-wider text-center mb-1">Most Popular</div>
            <h2 class="text-xl font-bold text-center">Pro</h2>
            <p class="text-4xl font-bold text-center mt-2">$149<span class="text-lg font-normal">/month</span></p>
          </div>
          <div class="p-6">
            <ul class="space-y-3">
              <li class="flex items-start">
                <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>500,000 API calls/month</span>
              </li>
              <li class="flex items-start">
                <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Access to 50 languages</span>
              </li>
              <li class="flex items-start">
                <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Advanced translation API</span>
              </li>
              <li class="flex items-start">
                <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Pronunciation assessment</span>
              </li>
              <li class="flex items-start">
                <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Grammar checking</span>
              </li>
              <li class="flex items-start">
                <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Priority support</span>
              </li>
            </ul>
            <button class="w-full mt-6 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md">
              Get Started
            </button>
          </div>
        </div>
        
        {/* Enterprise Plan */}
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="bg-indigo-50 p-6">
            <h2 class="text-xl font-bold text-center">Enterprise</h2>
            <p class="text-4xl font-bold text-center mt-2">Custom</p>
          </div>
          <div class="p-6">
            <ul class="space-y-3">
              <li class="flex items-start">
                <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Unlimited API calls</span>
              </li>
              <li class="flex items-start">
                <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>All 100+ languages</span>
              </li>
              <li class="flex items-start">
                <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Custom language models</span>
              </li>
              <li class="flex items-start">
                <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Advanced analytics</span>
              </li>
              <li class="flex items-start">
                <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Dedicated account manager</span>
              </li>
              <li class="flex items-start">
                <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>SLA guarantees</span>
              </li>
            </ul>
            <button class="w-full mt-6 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-2xl font-semibold mb-4">API Features Included in All Plans</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-start">
            <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Text translation API</span>
          </div>
          <div class="flex items-start">
            <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Vocabulary lookup</span>
          </div>
          <div class="flex items-start">
            <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Language detection</span>
          </div>
          <div class="flex items-start">
            <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Basic text-to-speech</span>
          </div>
          <div class="flex items-start">
            <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>API documentation</span>
          </div>
          <div class="flex items-start">
            <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>API key management</span>
          </div>
        </div>
      </div>
      
      <div class="bg-indigo-50 rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div class="space-y-4">
          <div>
            <h3 class="font-medium text-lg mb-2">What happens if I exceed my monthly API calls?</h3>
            <p class="text-gray-700">
              If you exceed your monthly API call limit, you'll be charged a small fee per additional API call. We'll notify you when you reach 80% of your limit so you can upgrade if needed.
            </p>
          </div>
          <div>
            <h3 class="font-medium text-lg mb-2">Can I switch plans at any time?</h3>
            <p class="text-gray-700">
              Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle.
            </p>
          </div>
          <div>
            <h3 class="font-medium text-lg mb-2">Do you offer a free trial?</h3>
            <p class="text-gray-700">
              Yes, we offer a 14-day free trial of our Pro plan for new users. No credit card required to start.
            </p>
          </div>
          <div>
            <h3 class="font-medium text-lg mb-2">What languages are supported?</h3>
            <p class="text-gray-700">
              Our API supports over 100 languages, with varying levels of feature support depending on your plan. Check our documentation for a complete list of supported languages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'API Pricing - AlsoSpeak',
  meta: [
    {
      name: 'description',
      content: 'Explore AlsoSpeak API pricing plans for language learning applications. Choose from Basic, Pro, and Enterprise tiers to power your mobile app.',
    },
  ],
};
