import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
  
  // Rust Server Configuration
  RUST_SERVER_IP: z.string(),
  RUST_SERVER_PORT: z.string(),
  RUST_PLUS_PORT: z.string().optional(),
  RUST_PLAYER_TOKEN: z.string().optional(),
  
  // Database
  DATABASE_PATH: z.string().default('./data/aor.db'),
  
  // API Keys
  BATTLEMETRICS_API_KEY: z.string().optional(),
  
  // CORS
  CORS_ORIGIN: z.string().default('*'),
  
  // Features
  ENABLE_RUST_PLUS: z.string().transform(val => val === 'true').default('false'),
  ENABLE_BATTLEMETRICS: z.string().transform(val => val === 'true').default('false'),
})

export type Env = z.infer<typeof envSchema>

let env: Env

try {
  env = envSchema.parse(process.env)
} catch (error) {
  console.error('❌ Invalid environment variables:', error)
  process.exit(1)
}

export { env }
