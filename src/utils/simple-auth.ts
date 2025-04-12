import { createHash } from 'crypto';
import { createTransport } from 'nodemailer';

// Simple token generation using crypto without database dependency
export function generateSimpleMagicLinkToken(email: string): string {
  const timestamp = Date.now();
  const secretKey = process.env.AUTH_SECRET || 'alsospeak-language-learning-api-secret-key';
  const data = `${email}:${createHash('sha256').update(`${email}:${timestamp}:${secretKey}`).digest('hex')}:${timestamp}`;
  return Buffer.from(data).toString('base64');
}

// Verify a magic link token without database dependency
export function verifySimpleMagicLinkToken(token: string): { email: string } | null {
  try {
    const data = Buffer.from(token, 'base64').toString();
    const [email, hash, timestamp] = data.split(':');
    
    // Check if token is expired (1 hour)
    const tokenTime = parseInt(timestamp);
    const currentTime = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    if (currentTime - tokenTime > oneHour) {
      console.log('Token expired');
      return null; // Token expired
    }
    
    // Verify the hash
    const secretKey = process.env.AUTH_SECRET || 'alsospeak-language-learning-api-secret-key';
    const expectedHash = createHash('sha256').update(`${email}:${timestamp}:${secretKey}`).digest('hex');
    if (hash !== expectedHash) {
      console.log('Invalid token hash');
      console.log('Expected hash:', expectedHash);
      console.log('Actual hash:', hash);
      return null;
    }
    
    return { email };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Function to create email transporter
export function createEmailTransporter() {
  return createTransport({
    host: process.env.EMAIL_SERVER_HOST || 'smtp.ethereal.email',
    port: Number(process.env.EMAIL_SERVER_PORT || 587),
    secure: false,
    auth: {
      user: process.env.EMAIL_SERVER_USER || 'test@example.com',
      pass: process.env.EMAIL_SERVER_PASSWORD || 'password',
    },
  });
}

// Send magic link email
export async function sendSimpleMagicLinkEmail(
  email: string, 
  token: string, 
  redirectTo?: string,
  verifyPath: string = '/auth/simple-verify'
): Promise<boolean> {
  // Create a clean magic link URL without any trailing slashes
  const baseUrl = process.env.PUBLIC_HOST || 'http://localhost:3000';
  const magicLinkUrl = new URL(verifyPath, baseUrl);
  magicLinkUrl.searchParams.set('token', token);
  if (redirectTo) {
    magicLinkUrl.searchParams.set('redirectTo', redirectTo);
  }
  
  console.log('Generated magic link:', magicLinkUrl.toString());
  
  try {
    // Always log the link for testing purposes
    console.log('Magic link for testing:', magicLinkUrl.toString());
    
    const transporter = createEmailTransporter();
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@alsospeak.com',
      to: email,
      subject: 'Sign in to AlsoSpeak',
      text: `Click this link to sign in to your AlsoSpeak account: ${magicLinkUrl.toString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Sign in to AlsoSpeak</h2>
          <p>Click the button below to sign in to your AlsoSpeak account. This link will expire in 1 hour.</p>
          <a href="${magicLinkUrl.toString()}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Sign in to AlsoSpeak</a>
          <p>If you didn't request this email, you can safely ignore it.</p>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #6B7280;">${magicLinkUrl.toString()}</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Failed to send magic link email:', error);
    // Still return true so users can test with the console link
    return true;
  }
}
