import {ENV} from '../config/env';
import resend from '../lib/resend';
/**
 * sends verification email to specified email
 * @param email users email
 * @param token verification token
 */
export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
    const verifyUrl = `${ENV.CLIENT_URL}/auth/verify-email?token=${token}`;
    await resend.emails.send({
        from: `${ENV.EMAIL_DOMAIN}`,
        to: email,
        subject: 'Verify your email',
        html: `<a href="${verifyUrl}">Verify Email</a>`
    });
};
/**
 * Sends a reset password email to user
 * @param email user email
 * @param token reset password token
 */
export const sendResetPassEmail = async (email: string, token: string): Promise<void> => {
    const verifyUrl = `${ENV.CLIENT_URL}/auth/reset-password?token=${token}`;
    await resend.emails.send({
        from: `${ENV.EMAIL_DOMAIN}`,
        to: email,
        subject: 'Reset Your Password!',
        html: `<a href="${verifyUrl}">Reset Password</a>`
    });
};
