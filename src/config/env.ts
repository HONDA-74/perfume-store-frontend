import { z } from 'zod';

/**
 * Validates `import.meta.env` at module-load time so the app fails fast
 * with a clear error if a required `VITE_*` variable is missing/malformed —
 * the same "fail fast, never fail silently" posture as the backend's
 * `config/validation.schema.ts`.
 *
 * Only variables prefixed `VITE_` are ever exposed to client code by Vite;
 * see `.env.example` for the full documented list.
 */
const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_API_TIMEOUT_MS: z.coerce.number().positive().default(15000),
  VITE_APP_NAME: z.string().default('Luxury Perfume Store'),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  VITE_DEV_SERVER_PORT: z.coerce.number().positive().default(5173),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration — check your .env file against .env.example.');
}

/**
 * Camel-cased, typed environment accessor. Import this everywhere instead
 * of reading `import.meta.env` directly.
 */
export const env = {
  apiBaseUrl: parsed.data.VITE_API_BASE_URL,
  apiTimeoutMs: parsed.data.VITE_API_TIMEOUT_MS,
  appName: parsed.data.VITE_APP_NAME,
  appEnv: parsed.data.VITE_APP_ENV,
  devServerPort: parsed.data.VITE_DEV_SERVER_PORT,
  isDevelopment: parsed.data.VITE_APP_ENV === 'development',
  isProduction: parsed.data.VITE_APP_ENV === 'production',
} as const;
