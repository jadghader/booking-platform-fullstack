import { createConnection, Connection } from "mysql2";
import "reflect-metadata";
import { env } from './config/env'


const db: Connection = createConnection({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
});

export default db;
