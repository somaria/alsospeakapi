import { component$, useSignal, $ } from '@builder.io/qwik';
import { server$, type DocumentHead } from '@builder.io/qwik-city';
import { generateMagicLinkToken, sendMagicLinkEmail } from '~/utils/auth';

// Server-side function to handle magic link generation and sending
export const sendMagicLink = server$(async (email: string) => {
  try {
    // Generate a token for the user
    const token = generateMagicLinkToken(email);
    
    // Send the magic link email
    const sent = await sendMagicLinkEmail(email, token, '/', '/auth/verify');
    
    return { success: sent, message: sent ? 'Magic link sent!' : 'Failed to send magic link' };
  } catch (error) {
    console.error('Error sending magic link:', error);
    return { success: false, message: 'An error occurred while sending the magic link' };
  }
});

export default component$(() => {
  const email = useSignal('');
  const isSubmitting = useSignal(false);
  const message = useSignal('');
  const messageType = useSignal<'success' | 'error' | ''>('');
  const isValidEmail = useSignal(true);
  
  // Function to validate email format
  const validateEmail = $((value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isValidEmail.value = emailRegex.test(value);
    return isValidEmail.value;
  });

  // Handle form submission
  const handleSubmit = $(async () => {
    if (!email.value) {
      message.value = 'Please enter your email address';
      messageType.value = 'error';
      return;
    }
    
    if (!isValidEmail.value) {
      message.value = 'Please enter a valid email address';
      messageType.value = 'error';
      return;
    }
    
    isSubmitting.value = true;
    message.value = '';
    messageType.value = '';

    try {
      // Send the magic link
      const result = await sendMagicLink(email.value);
      
      message.value = result.message;
      messageType.value = result.success ? 'success' : 'error';
      
      if (result.success) {
        email.value = '';
      }
    } catch (error) {
      console.error('Error sending magic link:', error);
      message.value = 'An error occurred while sending the magic link';
      messageType.value = 'error';
    } finally {
      isSubmitting.value = false;
    }
  });

  return (
    <div class="max-w-md mx-auto">
      <div class="bg-white p-8 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Sign in to AlsoSpeak</h1>
        
        <p class="text-gray-600 mb-6">
          Enter your email address and we'll send you a magic link to sign in instantly.
        </p>
        
        <form 
          preventdefault:submit
          onSubmit$={handleSubmit}
          class="space-y-4"
        >
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email.value}
              onInput$={(e) => {
                email.value = (e.target as HTMLInputElement).value;
                validateEmail(email.value);
              }}
              class={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                !isValidEmail.value && email.value ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {!isValidEmail.value && email.value && (
              <p class="mt-1 text-sm text-red-600">Please enter a valid email address</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting.value}
            class={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isSubmitting.value ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting.value ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>
        
        {message.value && (
          <div 
            class={`mt-4 p-3 rounded-md ${
              messageType.value === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {message.value}
          </div>
        )}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Sign In - AlsoSpeak',
  meta: [
    {
      name: 'description',
      content: 'Sign in to your AlsoSpeak account with a magic link.',
    },
  ],
};
