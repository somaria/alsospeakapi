import { createHash } from 'crypto';
import { createTransport } from 'nodemailer';

// Simple token generation using crypto
export function generateMagicLinkToken(email: string): string {
  const timestamp = Date.now();
  const data = `${email}:${createHash('sha256').update(`${email}:${timestamp}:${process.env.AUTH_SECRET || 'default-secret-key'}`).digest('hex')}:${timestamp}`;
  return Buffer.from(data).toString('base64');
}

// Verify a magic link token
export function verifyToken(token: string): { email: string } | null {
  try {
    // Use the same secret key as token generation
    const secretKey = process.env.AUTH_SECRET || 'default-secret-key';
    console.log('Using fixed secret key for verification');
    
    // Decode the token
    const data = Buffer.from(token, 'base64').toString();
    console.log('Decoded token data:', data);
    
    // Split the token data
    const parts = data.split(':');
    if (parts.length !== 3) {
      console.log('Invalid token format - expected 3 parts, got', parts.length);
      return null;
    }
    
    const [email, hash, timestamp] = parts;
    const tokenTime = parseInt(timestamp);
    
    // Check if token is expired (24 hours to be safe)
    const currentTime = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    console.log('Token timestamp:', tokenTime);
    console.log('Current timestamp:', currentTime);
    console.log('Time difference (ms):', currentTime - tokenTime);
    
    if (currentTime - tokenTime > oneDay) {
      console.log('Token expired - more than 24 hours old');
      return null;
    }
    
    // Verify the hash
    const expectedHash = createHash('sha256')
      .update(`${email}:${timestamp}:${secretKey}`)
      .digest('hex');
    
    console.log('Expected hash:', expectedHash);
    console.log('Actual hash:', hash);
    
    if (hash !== expectedHash) {
      console.log('Invalid token hash - hash mismatch');
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
  // For development, use a test email service like Ethereal or Mailtrap
  // For production, use your actual email service
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
export async function sendMagicLinkEmail(
  email: string, 
  token: string, 
  redirectTo?: string,
  verifyPath: string = '/auth/robust/verify'
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
    // For development, log the link for testing purposes
    console.log('Magic link for testing:', magicLinkUrl.toString());
    
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
    
    return true;
  } catch (error) {
    console.error('Failed to send magic link email:', error);
    return false;
  }
}
