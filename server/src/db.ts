import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

export const pool = process.env.DATABASE_URL
    ? new Pool({ connectionString: process.env.DATABASE_URL, })
    : new Pool();
