import { component$, useSignal, $ } from '@builder.io/qwik';
import { server$, type DocumentHead } from '@builder.io/qwik-city';
import { generateMagicLinkToken, createEmailTransporter } from '~/utils/auth';

// Server-side function to handle magic link generation and sending
export const sendMagicLink = server$(async (email: string) => {
  try {
    // Generate a token
    const token = generateMagicLinkToken(email);
    
    // Create the magic link URL
    const baseUrl = process.env.PUBLIC_HOST || 'https://alsospeakapi.fly.dev';
    const magicLinkUrl = new URL('/auth/robust/verify', baseUrl);
    magicLinkUrl.searchParams.set('token', token);
    magicLinkUrl.searchParams.set('redirectTo', '/');
    
    // Log the magic link for testing
    console.log('Magic link URL:', magicLinkUrl.toString());
    
    // Send the email
    const transporter = createEmailTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@alsospeak.com',
      to: email,
      subject: 'Sign in to AlsoSpeak Language Learning API',
      text: `Click this link to sign in to your AlsoSpeak Language Learning API account: ${magicLinkUrl.toString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Sign in to AlsoSpeak Language Learning API</h2>
          <p>Click the button below to sign in to your AlsoSpeak Language Learning API account. This link will expire in 24 hours.</p>
          <a href="${magicLinkUrl.toString()}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Sign in to AlsoSpeak</a>
          <p>If you didn't request this email, you can safely ignore it.</p>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #4F46E5;">${magicLinkUrl.toString()}</p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #E5E7EB;" />
          <p style="color: #6B7280; font-size: 14px;">This link will expire in 24 hours. After that, you'll need to request a new sign-in link.</p>
        </div>
      `,
    });
    
    return {
      success: true,
      message: 'Magic link sent successfully! Check your email.',
      email,
    };
  } catch (error) {
    console.error('Error sending magic link:', error);
    return {
      success: false,
      message: 'Error sending magic link',
      error: error instanceof Error ? error.message : String(error),
    };
  }
});

export default component$(() => {
  const email = useSignal('');
  const message = useSignal('');
  const messageType = useSignal('');
  const isSubmitting = useSignal(false);
  
  const handleSubmit = $(async () => {
    isSubmitting.value = true;
    message.value = '';
    messageType.value = '';

    try {
      // Generate the magic link
      const result = await sendMagicLink(email.value);
      
      message.value = result.message;
      messageType.value = result.success ? 'success' : 'error';
      if (result.success) {
        email.value = '';
      }
    } catch (error) {
      console.error('Error generating magic link:', error);
      message.value = 'An error occurred while generating the magic link';
      messageType.value = 'error';
    } finally {
      isSubmitting.value = false;
    }
  });

  return (
    <div class="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Sign in to AlsoSpeak</h1>
        
        <p class="text-gray-600 mb-6">
          Enter your email address and we'll generate a magic link to sign in instantly.
        </p>
        
        <form 
          preventdefault:submit
          onSubmit$={handleSubmit}
          class="space-y-6"
        >
          <div>
            <label 
              for="email" 
              class="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div class="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                required
                bind:value={email}
                class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          {message.value && (
            <div class={`rounded-md p-4 ${
              messageType.value === 'success' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <p class={`text-sm ${
                messageType.value === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {message.value}
              </p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting.value}
            class={`flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              isSubmitting.value ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting.value ? 'Generating...' : 'Generate Magic Link'}
          </button>
        </form>
        
        {message.value && messageType.value === 'success' && (
          <div class="mt-6">
            <p class="text-sm text-gray-600">
              Check your email for the magic link.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Sign in - AlsoSpeak Language Learning API',
  meta: [
    {
      name: 'description',
      content: 'Sign in to access AlsoSpeak Language Learning API services.',
    },
  ],
};
