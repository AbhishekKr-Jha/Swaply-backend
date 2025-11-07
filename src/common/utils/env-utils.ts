// Example: Using Env in a database connection utility
import Env from '../config/build_env.js';

/**
 * Database configuration using centralized Env
 */
export const databaseConfig = {
  host: Env.DB_HOST,
  port: Env.DB_PORT,
  username: Env.DB_USER,
  password: Env.DB_PASSWORD,
  database: Env.DB_NAME,
  dialect: Env.DB_DIALECT as 'mysql' | 'postgres' | 'sqlite' | 'mariadb',
  logging: Env.isDevelopment() ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

/**
 * JWT configuration using centralized Env
 */
export const jwtConfig = {
  secret: Env.JWT_SECRET,
  expiresIn: Env.JWT_EXPIRES_IN,
  refreshSecret: Env.JWT_REFRESH_SECRET,
  refreshExpiresIn: Env.JWT_REFRESH_EXPIRES_IN,
};

/**
 * Example function that uses environment variables
 */
export function createApiUrl(endpoint: string): string {
  return `${Env.getServerUrl()}${Env.getApiBasePath()}${endpoint}`;
}

/**
 * Example validation function
 */
export function validateEnvironment(): boolean {
  const required = [Env.JWT_SECRET, Env.DB_HOST, Env.DB_NAME, Env.DB_USER];

  return required.every(value => value && value.trim() !== '');
}
