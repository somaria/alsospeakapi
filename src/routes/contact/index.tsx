import { component$, useSignal, $ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  const name = useSignal('');
  const email = useSignal('');
  const subject = useSignal('');
  const message = useSignal('');
  const isSubmitting = useSignal(false);
  const submitStatus = useSignal<'idle' | 'success' | 'error'>('idle');
  
  const handleSubmit = $(() => {
    isSubmitting.value = true;
    
    // Simulate form submission
    setTimeout(() => {
      isSubmitting.value = false;
      submitStatus.value = 'success';
      
      // Reset form
      name.value = '';
      email.value = '';
      subject.value = '';
      message.value = '';
      
      // Reset status after 5 seconds
      setTimeout(() => {
        submitStatus.value = 'idle';
      }, 5000);
    }, 1500);
  });
  
  return (
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Contact Our Language API Team</h1>
      
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <p class="text-gray-700 mb-6">
          Have questions about our language learning API? Need technical support or want to discuss integration with your mobile app? Our team is here to help you build better language learning experiences.
        </p>
        
        {submitStatus.value === 'success' && (
          <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            Thank you for your message! Our language API team will get back to you soon.
          </div>
        )}
        
        {submitStatus.value === 'error' && (
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            There was an error sending your message. Please try again.
          </div>
        )}
        
        <form 
          preventdefault:submit
          onSubmit$={handleSubmit}
          class="space-y-4"
        >
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name.value}
              onInput$={(e) => name.value = (e.target as HTMLInputElement).value}
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email.value}
              onInput$={(e) => email.value = (e.target as HTMLInputElement).value}
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <select
              id="subject"
              value={subject.value}
              onChange$={(e) => subject.value = (e.target as HTMLSelectElement).value}
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select a topic</option>
              <option value="Language API Support">Language API Support</option>
              <option value="Translation Services">Translation Services</option>
              <option value="Speech Recognition">Speech Recognition</option>
              <option value="Mobile Integration">Mobile Integration</option>
              <option value="Pricing & Plans">Pricing & Plans</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              value={message.value}
              onInput$={(e) => message.value = (e.target as HTMLTextAreaElement).value}
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            ></textarea>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting.value}
            class={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isSubmitting.value ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting.value ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Other Ways to Reach Us</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-medium text-gray-900 mb-2">Language API Support</h3>
            <p class="text-gray-700">api-support@alsospeak.com</p>
          </div>
          
          <div>
            <h3 class="font-medium text-gray-900 mb-2">Technical Support</h3>
            <p class="text-gray-700">+1 (555) 123-4567</p>
          </div>
          
          <div>
            <h3 class="font-medium text-gray-900 mb-2">API Documentation</h3>
            <p class="text-gray-700">
              <a href="/docs" class="text-indigo-600 hover:text-indigo-800">
                Visit our Language API Documentation
              </a>
            </p>
          </div>
          
          <div>
            <h3 class="font-medium text-gray-900 mb-2">Developer Community</h3>
            <p class="text-gray-700">
              <a href="https://github.com/alsospeak" class="text-indigo-600 hover:text-indigo-800" target="_blank" rel="noopener noreferrer">
                Join our GitHub Community
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Contact - AlsoSpeak Language Learning API',
  meta: [
    {
      name: 'description',
      content: 'Get in touch with the AlsoSpeak language API team. We\'re here to help with any questions about our language learning API platform.',
    },
  ],
};
