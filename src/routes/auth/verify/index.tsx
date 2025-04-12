import { component$ } from '@builder.io/qwik';
import { routeLoader$, useLocation, Form, routeAction$, type DocumentHead } from '@builder.io/qwik-city';
import { verifyMagicLinkToken } from '~/utils/auth';
import { findOrCreateUser, updateUserLastLogin, createSession } from '~/utils/db';

// Route loader to verify the token on page load
export const useVerifyToken = routeLoader$(async ({ query, cookie, redirect, url }) => {
  // Get token from query parameters
  let token = query.get('token') || '';
  
  console.log('Auth-verify route accessed with URL:', url.toString());
  console.log('Token from query params:', token);
  
  // If no token in query params, try to extract it from the URL
  if (!token) {
    const urlString = url.toString();
    console.log('Attempting to extract token from URL:', urlString);
    
    // Try various methods to extract the token
    const tokenMatch = urlString.match(/token=([^&]+)/);
    if (tokenMatch && tokenMatch[1]) {
      token = tokenMatch[1];
      console.log('Extracted token from URL regex:', token.substring(0, 20) + '...');
    }
  }
  
  const redirectTo = query.get('redirectTo') || '/';
  
  if (!token) {
    return { 
      valid: false, 
      message: 'No token provided' 
    };
  }
  
  console.log('Processing token:', token.substring(0, 20) + '...');
  
  const decoded = await verifyMagicLinkToken(token);
  
  if (!decoded) {
    return { 
      valid: false, 
      message: 'Invalid or expired token' 
    };
  }

  console.log('Token verified successfully for email:', decoded.email);

  try {
    // Find or create the user in the database
    console.log('Finding or creating user with email:', decoded.email);
    const user = await findOrCreateUser(decoded.email);
    
    // Try to update the last login time
    try {
      console.log('Updating last login for user:', decoded.email);
      await updateUserLastLogin(decoded.email);
    } catch (updateError) {
      console.error('Error updating last login, but continuing:', updateError);
      // Continue with authentication even if update fails
    }
    
    // Create a session
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // 7 days from now
    
    const sessionToken = crypto.randomUUID();
    await createSession(user.id, sessionToken, expires);
    
    // Set authentication cookie
    console.log('Setting authentication cookie for user:', decoded.email);
    cookie.set('auth', JSON.stringify({ 
      email: decoded.email, 
      authenticated: true,
      userId: user.id,
      sessionToken
    }), {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax'
    });
    
    // Redirect to home page or the original destination
    console.log('Authentication successful, redirecting to:', redirectTo);
    throw redirect(302, redirectTo);
  } catch (error) {
    console.error('Database error during authentication:', error);
    return {
      valid: false,
      message: 'An error occurred during authentication'
    };
  }
});

// Action to handle manual verification (fallback)
export const useManualVerify = routeAction$(async ({ token }, { cookie, redirect, url }) => {
  const searchParams = new URL(url).searchParams;
  const redirectTo = searchParams.get('redirectTo') || '/';
  
  console.log('Manual verification attempted with token:', token ? 'Present' : 'Not present');
  
  if (!token) {
    return { 
      success: false, 
      message: 'No token provided' 
    };
  }
  
  const decoded = await verifyMagicLinkToken(token as string);
  
  if (!decoded) {
    return { 
      success: false, 
      message: 'Invalid or expired token' 
    };
  }

  console.log('Token verified successfully for email:', decoded.email);

  try {
    // Find or create the user in the database
    console.log('Finding or creating user with email:', decoded.email);
    const user = await findOrCreateUser(decoded.email);
    
    // Try to update the last login time
    try {
      console.log('Updating last login for user:', decoded.email);
      await updateUserLastLogin(decoded.email);
    } catch (updateError) {
      console.error('Error updating last login, but continuing:', updateError);
      // Continue with authentication even if update fails
    }
    
    // Create a session
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // 7 days from now
    
    const sessionToken = crypto.randomUUID();
    await createSession(user.id, sessionToken, expires);
    
    // Set authentication cookie
    console.log('Setting authentication cookie for user:', decoded.email);
    cookie.set('auth', JSON.stringify({ 
      email: decoded.email, 
      authenticated: true,
      userId: user.id,
      sessionToken
    }), {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax'
    });
    
    // Redirect to home page or the original destination
    console.log('Authentication successful, redirecting to:', redirectTo);
    throw redirect(302, redirectTo);
  } catch (error) {
    console.error('Database error during authentication:', error);
    return {
      success: false,
      message: 'An error occurred during authentication'
    };
  }
});

export default component$(() => {
  const location = useLocation();
  const verifyResult = useVerifyToken();
  const manualVerify = useManualVerify();
  
  return (
    <div class="flex flex-col items-center justify-center p-4">
      <h1 class="text-2xl font-bold mb-4">Verifying your sign in</h1>
      
      {verifyResult.value.valid === false && (
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>An error occurred during authentication</p>
          <p>{verifyResult.value.message}</p>
        </div>
      )}
      
      {verifyResult.value.valid === false && (
        <div class="mt-4">
          <p>If you were redirected automatically but verification failed, you can try manual verification:</p>
          <Form action={manualVerify}>
            <input type="hidden" name="token" value={location.url.searchParams.get('token') || ''} />
            <button 
              type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 w-full"
            >
              Verify Manually
            </button>
          </Form>
          <div class="mt-4 text-center">
            <a href="/signin" class="text-blue-500 hover:underline">Return to sign in</a>
          </div>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Verify Sign In - AlsoSpeak',
  meta: [
    {
      name: 'description',
      content: 'Verify your sign in to AlsoSpeak.',
    },
  ],
};
