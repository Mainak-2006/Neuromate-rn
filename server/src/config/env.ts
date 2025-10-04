import { config } from 'dotenv';
import createHttpError from 'http-errors';

config();

const requiredEnv = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'CLERK_SECRET_KEY'];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw createHttpError(500, `Missing required environment variable: ${key}`);
  }
});

export const env = {
  port: Number.parseInt(process.env.PORT ?? '4000', 10),
  supabaseUrl: process.env.SUPABASE_URL as string,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  clerkSecretKey: process.env.CLERK_SECRET_KEY as string,
  clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
};
