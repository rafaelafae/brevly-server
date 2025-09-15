import { z } from 'zod'

const envSchema = z.object({
    PORT: z.coerce.number().default(1919),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
    DATABASE_URL: z.url().startsWith('postgresql://')
})

export const env = envSchema.parse(process.env)