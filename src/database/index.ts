import { DataSource } from 'typeorm';
import config from '../config/config.js';

export const appDataSource = new DataSource({
  type: 'postgres',
  url: config.DB_URL,
  migrationsTableName: 'migrations_table',
  migrations: ['./dist/sts/database/migration'],
});
