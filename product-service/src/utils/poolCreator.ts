import { Pool } from 'pg';

const { PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT } = process.env;

export const createPool = (): Pool =>
  new Pool({
    host: PGHOST,
    user: PGUSER,
    database: PGDATABASE,
    password: PGPASSWORD,
    port: Number(PGPORT),
  });
