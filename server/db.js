import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL || '';

export const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 3500,
  idleTimeoutMillis: 10000,
  max: 10,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('⚡ Connected to Neon PostgreSQL Database successfully!');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle Neon PostgreSQL client:', err);
});
