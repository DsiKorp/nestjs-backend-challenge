import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { join } from 'path';
import * as dotenvx from '@dotenvx/dotenvx';

// Load environment variables from .env file
dotenvx.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

// Get environment variables with fallbacks
const url = process.env.SCHEMATOGO_URL;
const host = process.env.DATABASE_HOST || 'localhost';
const port = parseInt(process.env.DATABASE_PORT || '5432');
const username = process.env.DATABASE_USER || 'postgres';
const password = process.env.DATABASE_PASSWORD || 'postgres';
const database = process.env.DATABASE_NAME || 'usersdb';
const synchronize = process.env.DATABASE_SYNC === 'true' ? true : false;

console.log(`Database synchronize mode: ${synchronize}`);

// Create data source configuration
const dataSourceConfig = url
  ? {
      type: 'postgres' as const,
      url,
      entities: [User],
      synchronize,
      migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
    }
  : {
      type: 'postgres' as const,
      host,
      port,
      username,
      password,
      database,
      entities: [User],
      synchronize: synchronize,
      migrations: [
        join(__dirname, '..', 'migrations', '*.{ts,js}'),
        join(__dirname, '..', 'seed-migrations', '*.{ts,js}'),
      ],
      migrationsTableName: 'custom_migration_table',
    };

export const AppDataSource = new DataSource(dataSourceConfig);

// Add a listener to see when initialization happens
AppDataSource.initialize().then(() => {
  console.log('DataSource initialized successfully');
}).catch(error => {
  console.error('Error initializing DataSource:', error);
});
