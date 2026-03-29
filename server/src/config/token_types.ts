import { tokens_type } from '@prisma/client';

export const TOKEN_TYPES: Record<string, tokens_type> = {
  EMAIL_VERIFICATION: tokens_type.EMAIL_VERIFICATION,
  PASSWORD_RESET: tokens_type.RESET_PASS,
};

