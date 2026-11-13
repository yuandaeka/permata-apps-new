import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const vercelBaseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  API_BASE_URL: z.string().default(vercelBaseUrl ?? 'http://localhost:4000'),
  WEB_APP_URL: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  ACCESS_TOKEN_SECRET: z.string().min(32, 'ACCESS_TOKEN_SECRET must be at least 32 chars'),
  REFRESH_TOKEN_SECRET: z.string().min(32, 'REFRESH_TOKEN_SECRET must be at least 32 chars'),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL: z.string().default('7d'),
  OBJECT_STORAGE_ENDPOINT: z.string().optional(),
  OBJECT_STORAGE_BUCKET: z.string().optional(),
  OBJECT_STORAGE_ACCESS_KEY: z.string().optional(),
  OBJECT_STORAGE_SECRET_KEY: z.string().optional(),
  AI_PROVIDER: z.string().optional(),
  AI_API_KEY: z.string().optional(),
  AI_MODEL: z.string().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
});

function validateEnv() {
  const resolvedDatabaseUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    'postgresql://postgres:postgres@localhost:5432/permata';

  const resolvedAiApiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
  const resolvedAiProvider =
    process.env.AI_PROVIDER || (resolvedAiApiKey ? 'gemini' : undefined);

  const rawEnv = {
    ...process.env,
    DATABASE_URL: resolvedDatabaseUrl,
    ACCESS_TOKEN_SECRET:
      process.env.ACCESS_TOKEN_SECRET && process.env.ACCESS_TOKEN_SECRET.length >= 32
        ? process.env.ACCESS_TOKEN_SECRET
        : 'permata-default-access-token-secret-change-in-production-32chars',
    REFRESH_TOKEN_SECRET:
      process.env.REFRESH_TOKEN_SECRET && process.env.REFRESH_TOKEN_SECRET.length >= 32
        ? process.env.REFRESH_TOKEN_SECRET
        : 'permata-default-refresh-token-secret-change-in-production-32chars',
    AI_API_KEY: resolvedAiApiKey,
    AI_PROVIDER: resolvedAiProvider,
  };

  const result = envSchema.safeParse(rawEnv);
  if (!result.success) {
    console.error('Invalid environment variables:', result.error.flatten().fieldErrors);
    if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    return envSchema.parse({});
  }
  return result.data;
}

export const env = validateEnv();
export type Env = z.infer<typeof envSchema>;
