import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

const sslEnabled = (process.env.DB_SSL || '').toLowerCase() === 'true';
const sslRejectUnauthorized =
  (process.env.DB_SSL_REJECT_UNAUTHORIZED || 'false').toLowerCase() === 'true';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'auth_service_db',
  ssl: sslEnabled ? { rejectUnauthorized: sslRejectUnauthorized } : undefined,
  autoLoadEntities: true,
  synchronize: false,
};
