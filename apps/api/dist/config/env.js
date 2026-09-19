import 'dotenv/config';
import { z } from 'zod';
const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'test', 'production'])
        .default('development'),
    API_PORT: z.coerce.number().int().positive().default(4000),
    DATABASE_URL: z
        .string()
        .min(1)
        .default('postgresql://postgres:postgres@localhost:5432/fieldvoice'),
    AI_MODE: z.enum(['mock', 'live']).default('mock'),
    OPENAI_API_KEY: z.string().optional(),
    ANTHROPIC_API_KEY: z.string().optional(),
    SOCKET_PORT: z.coerce.number().int().positive().default(4001)
});
export const env = envSchema.parse(process.env);
