import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Language Learning API Features</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-3">Real-time Translation</h2>
          <p class="text-gray-700">
            Power your language learning app with our high-performance translation API. Support for over 100 languages with context-aware translations that understand idioms and cultural nuances.
          </p>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-3">Text-to-Speech & Speech-to-Text</h2>
          <p class="text-gray-700">
            Enable natural pronunciation learning with our voice APIs. Convert text to speech in native accents and analyze user speech for pronunciation feedback.
          </p>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-3">Vocabulary Management</h2>
          <p class="text-gray-700">
            Access comprehensive vocabulary databases with definitions, usage examples, difficulty levels, and semantic relationships to build effective learning modules.
          </p>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-3">Grammar Analysis</h2>
          <p class="text-gray-700">
            Identify grammatical structures, provide correction suggestions, and explain grammar rules to help users improve their language skills systematically.
          </p>
        </div>
      </div>
      
      <div class="bg-indigo-50 rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-2xl font-semibold mb-4">Supported Languages</h2>
        <p class="text-gray-700 mb-4">
          AlsoSpeak API supports over 100 languages for translation, with varying levels of feature support:
        </p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div class="bg-white rounded p-2 text-center">English</div>
          <div class="bg-white rounded p-2 text-center">Spanish</div>
          <div class="bg-white rounded p-2 text-center">French</div>
          <div class="bg-white rounded p-2 text-center">German</div>
          <div class="bg-white rounded p-2 text-center">Chinese</div>
          <div class="bg-white rounded p-2 text-center">Japanese</div>
          <div class="bg-white rounded p-2 text-center">Russian</div>
          <div class="bg-white rounded p-2 text-center">Arabic</div>
          <div class="bg-white rounded p-2 text-center">Portuguese</div>
          <div class="bg-white rounded p-2 text-center">Italian</div>
          <div class="bg-white rounded p-2 text-center">Korean</div>
          <div class="bg-white rounded p-2 text-center">Hindi</div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-2xl font-semibold mb-4">Learning Enhancement APIs</h2>
        <p class="text-gray-700 mb-4">
          Specialized endpoints to create engaging language learning experiences:
        </p>
        <ul class="list-disc pl-6 text-gray-700 space-y-2">
          <li><span class="font-medium">Flashcard Generation:</span> Automatically create vocabulary flashcards with examples and images.</li>
          <li><span class="font-medium">Difficulty Assessment:</span> Analyze text to determine language proficiency level (A1-C2).</li>
          <li><span class="font-medium">Exercise Generation:</span> Create fill-in-the-blank, multiple choice, and other exercise types.</li>
          <li><span class="font-medium">Conversation Simulation:</span> Generate contextual dialogue scenarios for conversation practice.</li>
        </ul>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-4">Technical Features</h2>
        <ul class="list-disc pl-6 text-gray-700 space-y-2">
          <li><span class="font-medium">High Performance:</span> Low-latency API responses for real-time applications.</li>
          <li><span class="font-medium">Scalable Infrastructure:</span> Handles millions of requests daily with 99.9% uptime.</li>
          <li><span class="font-medium">Comprehensive Documentation:</span> Detailed API references, code samples, and integration guides.</li>
          <li><span class="font-medium">SDKs & Libraries:</span> Client libraries for iOS, Android, Web, and server-side integration.</li>
          <li><span class="font-medium">Analytics Dashboard:</span> Monitor usage, performance, and user engagement metrics.</li>
        </ul>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Language Learning API Features - AlsoSpeak',
  meta: [
    {
      name: 'description',
      content: 'Explore the powerful language learning API features of AlsoSpeak, including translation, speech, vocabulary, and grammar analysis tools for mobile apps.',
    },
  ],
};
