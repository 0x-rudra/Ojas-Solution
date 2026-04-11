import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Make sure to have POSTGRES_URL in your .env
const sql = neon(process.env.POSTGRES_URL || process.env.DATABASE_URL!);
export const db = drizzle(sql);
