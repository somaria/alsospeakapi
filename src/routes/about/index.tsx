import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">About AlsoSpeak</h1>
      
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-2xl font-semibold mb-4">Our Mission</h2>
        <p class="text-gray-700 mb-4">
          AlsoSpeak is dedicated to breaking down language barriers and facilitating seamless language learning across different cultures. 
          Our API platform empowers mobile app developers to build exceptional language learning experiences with state-of-the-art translation, speech, and language analysis technologies.
        </p>
        <p class="text-gray-700">
          We believe that language should never be a barrier to understanding, connection, or opportunity. Our mission is to provide the technological foundation that helps people around the world learn new languages effectively and connect across linguistic boundaries.
        </p>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-2xl font-semibold mb-4">Our Story</h2>
        <p class="text-gray-700 mb-4">
          Founded in 2025, AlsoSpeak began as a passion project by a team of linguists, educators, and software engineers who were frustrated with the limitations of existing language learning tools. 
          We set out to create a comprehensive API solution that would power the next generation of language learning applications.
        </p>
        <p class="text-gray-700">
          Today, AlsoSpeak serves developers worldwide, helping them create innovative language learning apps that make mastering new languages more accessible, engaging, and effective for millions of users.
        </p>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-2xl font-semibold mb-4">Our Technology</h2>
        <p class="text-gray-700 mb-4">
          Our language learning API platform is built on cutting-edge technologies:
        </p>
        <ul class="list-disc pl-6 text-gray-700 space-y-2">
          <li><span class="font-medium">Advanced AI Models:</span> State-of-the-art neural networks for translation and language understanding.</li>
          <li><span class="font-medium">Natural Language Processing:</span> Sophisticated algorithms for grammar analysis and language structure.</li>
          <li><span class="font-medium">Speech Recognition & Synthesis:</span> High-quality voice processing for pronunciation training.</li>
          <li><span class="font-medium">Scalable Cloud Infrastructure:</span> Reliable, low-latency API delivery worldwide.</li>
        </ul>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-4">Our Values</h2>
        <ul class="list-disc pl-6 text-gray-700 space-y-2">
          <li><span class="font-medium">Accuracy:</span> We prioritize precise translations and language analysis that capture the true meaning of the original text.</li>
          <li><span class="font-medium">Inclusivity:</span> We strive to support as many languages as possible, including those that are less commonly taught.</li>
          <li><span class="font-medium">Education:</span> We believe in the power of language learning to transform lives and connect cultures.</li>
          <li><span class="font-medium">Innovation:</span> We continuously improve our technology to provide the best possible language learning tools.</li>
          <li><span class="font-medium">Developer Success:</span> We're committed to helping developers build successful language learning applications with comprehensive documentation, support, and tools.</li>
        </ul>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'About AlsoSpeak - Language Learning API',
  meta: [
    {
      name: 'description',
      content: 'Learn about AlsoSpeak, our mission to break down language barriers, and our powerful API platform for language learning applications.',
    },
  ],
};
