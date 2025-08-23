import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { config } from './config.js';
import * as schema from './schema.js';

if (!config.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

// Create connection pool
const pool = new Pool({ connectionString: config.DATABASE_URL });

// Create drizzle instance
export const db = drizzle(pool, { schema });

console.log('✅ Database connection established');