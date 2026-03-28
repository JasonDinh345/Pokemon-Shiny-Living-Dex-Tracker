import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;  
  await resend.emails.send({
    from: `${process.env.EMAIL_DOMAIN}`,
    to: email,       
    subject: 'Verify your email',
    html: `<a href="${verifyUrl}">Verify Email</a>`  
  });
};