import 'dotenv/config';
/**
 * gets the env value or throws and error
 * @param key value relating to a key in the .env file
 * @returns the env value
 */
const getEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};
/**
 * object of the env values
 */
export const ENV = {
    DATABASE_HOST: getEnv('DATABASE_HOST'),
    DATABASE_USER: getEnv('DATABASE_USER'),
    DATABASE_PASSWORD: getEnv('DATABASE_PASSWORD'),
    DATABASE_NAME: getEnv('DATABASE_NAME'),
    DATABASE_URL: getEnv('DATABASE_URL'),
    ACCESS_TOKEN_SECRET: getEnv('ACCESS_TOKEN_SECRET'),
    REFRESH_TOKEN_SECRET: getEnv('REFRESH_TOKEN_SECRET'),
    RESEND_API_KEY: getEnv('RESEND_API_KEY'),
    EMAIL_DOMAIN: getEnv('EMAIL_DOMAIN'),
    CLIENT_URL: getEnv('EMAIL_DOMAIN'),
    PROJECT_STATUS: process.env.PROJECT_STATUS || 'development',
    TEST_EMAIL: getEnv('TEST_EMAIL'),
};
