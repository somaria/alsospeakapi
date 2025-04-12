import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div class="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div class="text-center py-12 px-4">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          Powerful Language Learning APIs for Mobile Apps
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Build exceptional language learning experiences with AlsoSpeak's comprehensive API platform. Translation, speech, vocabulary, and more.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/sign-in" 
            class="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </Link>
          <Link 
            href="/docs" 
            class="px-6 py-3 bg-white text-indigo-600 font-medium rounded-md border border-indigo-200 hover:bg-indigo-50 transition-colors"
          >
            API Documentation
          </Link>
        </div>
      </div>

      {/* Feature Highlights */}
      <div class="py-12 bg-gray-50 rounded-xl px-4 mb-12">
        <h2 class="text-3xl font-bold text-center mb-12">
          Comprehensive Language Learning APIs
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Translation API</h3>
            <p class="text-gray-600">
              Context-aware translation across 100+ languages with idiom and cultural nuance understanding.
            </p>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Speech API</h3>
            <p class="text-gray-600">
              Text-to-speech and speech-to-text with native accents and pronunciation assessment.
            </p>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Vocabulary API</h3>
            <p class="text-gray-600">
              Comprehensive word databases with definitions, examples, difficulty levels, and semantic relationships.
            </p>
          </div>
        </div>
      </div>

      {/* API Preview */}
      <div class="mb-12 px-4">
        <h2 class="text-3xl font-bold text-center mb-8">
          Simple Integration, Powerful Results
        </h2>
        <div class="bg-gray-900 rounded-lg shadow-lg p-6 overflow-hidden">
          <div class="flex items-center mb-4">
            <div class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <pre class="text-green-400 overflow-x-auto">
            <code>
{`// Translate text with context
const response = await fetch('https://api.alsospeak.com/v1/translate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    text: 'Hello, how are you doing today?',
    source_language: 'en',
    target_language: 'es',
    context: 'casual_conversation'
  })
});

const data = await response.json();
console.log(data.translation);
// Output: "Hola, ¿cómo estás hoy?"`}
            </code>
          </pre>
        </div>
      </div>

      {/* Benefits */}
      <div class="py-12 bg-indigo-50 rounded-xl px-4 mb-12">
        <h2 class="text-3xl font-bold text-center mb-8">
          Why Choose AlsoSpeak API?
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div class="flex">
            <div class="flex-shrink-0 mt-1">
              <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-xl font-semibold mb-2">Language Learning Expertise</h3>
              <p class="text-gray-600">
                Built by linguists and educators specifically for language learning applications.
              </p>
            </div>
          </div>
          
          <div class="flex">
            <div class="flex-shrink-0 mt-1">
              <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-xl font-semibold mb-2">Comprehensive Solution</h3>
              <p class="text-gray-600">
                All the APIs you need for a complete language learning app in one platform.
              </p>
            </div>
          </div>
          
          <div class="flex">
            <div class="flex-shrink-0 mt-1">
              <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-xl font-semibold mb-2">High Performance</h3>
              <p class="text-gray-600">
                Low-latency responses for real-time language learning interactions.
              </p>
            </div>
          </div>
          
          <div class="flex">
            <div class="flex-shrink-0 mt-1">
              <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-xl font-semibold mb-2">Developer-Friendly</h3>
              <p class="text-gray-600">
                Extensive documentation, SDKs, and support to make integration easy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div class="text-center py-12 px-4 mb-8">
        <h2 class="text-3xl font-bold mb-4">
          Ready to Build Your Language Learning App?
        </h2>
        <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Join thousands of developers using AlsoSpeak API to create exceptional language learning experiences.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/sign-in" 
            class="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
          >
            Start Free Trial
          </Link>
          <Link 
            href="/pricing" 
            class="px-6 py-3 bg-white text-indigo-600 font-medium rounded-md border border-indigo-200 hover:bg-indigo-50 transition-colors"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'AlsoSpeak - Language Learning APIs for Mobile Apps',
  meta: [
    {
      name: 'description',
      content: 'AlsoSpeak provides powerful APIs for language learning mobile applications. Translation, speech, vocabulary, and more for building exceptional language learning experiences.',
    },
  ],
};
