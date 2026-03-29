import { ENV } from '../config/env';
import { Resend } from 'resend';

const resend = new Resend(ENV.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  const verifyUrl = `${ENV.CLIENT_URL}/verify-email?token=${token}`;  
  await resend.emails.send({
    from: `${ENV.EMAIL_DOMAIN}`,
    to: email,       
    subject: 'Verify your email',
    html: `<a href="${verifyUrl}">Verify Email</a>`  
  });
};


export const sendResetPassEmail = async (email: string, token: string): Promise<void> => {
  const verifyUrl = `${ENV.CLIENT_URL}/reset-password?token=${token}`;  
  await resend.emails.send({
    from: `${ENV.EMAIL_DOMAIN}`,
    to: email,       
    subject: 'Reset Your Password!',
    html: `<a href="${verifyUrl}">Reset Password</a>`  
  });
};