import dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables from .env file
dotenv.config({ path: join(process.cwd(), '.env') });

/**
 * Environment Configuration
 * This module centralizes all environment variable access
 * Use Env.VARIABLE_NAME anywhere in your application
 */
export class EnvConfig {
  // Server Configuration
  public readonly PORT: number = parseInt(process.env.PORT || '3000', 10);
  public readonly HOST: string = process.env.HOST || 'localhost';
  public readonly NODE_ENV: string = process.env.NODE_ENV || 'development';

  // Database Configuration
  public readonly DB_HOST: string = process.env.DB_HOST || 'localhost';
  public readonly DB_PORT: number = parseInt(process.env.DB_PORT || '3306', 10);
  public readonly DB_NAME: string = process.env.DB_NAME || 'resume_db';
  public readonly DB_USER: string = process.env.DB_USER || 'root';
  public readonly DB_PASSWORD: string = process.env.DB_PASSWORD || '';
  public readonly DB_DIALECT: string = process.env.DB_DIALECT || 'mysql';

  // JWT Configuration
  public readonly JWT_ACCESS_SECRET: string = process.env.JWT_ACCESS_SECRET || 'your-access-secret-key';
  public readonly JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
  public readonly JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key';
  public readonly JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '15m';
  public readonly JWT_REFRESH_EXPIRES_IN: string = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  // Cookie Configuration
  public readonly COOKIE_SECRET: string =
    process.env.COOKIE_SECRET || 'secret_must_be_at_least_32_chars_long_for_hapi_cookie';
  public readonly COOKIE_DOMAIN: string = process.env.COOKIE_DOMAIN || 'localhost';
  public readonly COOKIE_SECURE: boolean = process.env.COOKIE_SECURE === 'true';
  public readonly COOKIE_HTTP_ONLY: boolean = process.env.COOKIE_HTTP_ONLY !== 'false';

  // API Configuration
  public readonly API_PREFIX: string = process.env.API_PREFIX || '/api';
  public readonly API_VERSION: string = process.env.API_VERSION || 'v1';

  // CORS Configuration
  public readonly CORS_ORIGIN: string = process.env.CORS_ORIGIN || '*';
  public readonly CORS_CREDENTIALS: boolean = process.env.CORS_CREDENTIALS === 'true';
  public readonly DEV_ORIGIN: string = process.env.DEV_ORIGIN || 'http://localhost:5173';

  // File Upload Configuration
  public readonly MAX_FILE_SIZE: number = parseInt(process.env.MAX_FILE_SIZE || '10485760', 10); // 10MB
  public readonly UPLOAD_PATH: string = process.env.UPLOAD_PATH || './uploads';

  // Email Configuration (if needed)
  public readonly EMAIL_HOST: string = process.env.EMAIL_HOST || '';
  public readonly EMAIL_PORT: number = parseInt(process.env.EMAIL_PORT || '587', 10);
  public readonly EMAIL_USER: string = process.env.EMAIL_USER || '';
  public readonly EMAIL_PASSWORD: string = process.env.EMAIL_PASSWORD || '';
  public readonly EMAIL_FROM: string = process.env.EMAIL_FROM || '';

  // Redis Configuration (if needed)
  public readonly REDIS_HOST: string = process.env.REDIS_HOST || 'localhost';
  public readonly REDIS_PORT: number = parseInt(process.env.REDIS_PORT || '6379', 10);
  public readonly REDIS_PASSWORD: string = process.env.REDIS_PASSWORD || '';

  // Logging Configuration
  public readonly LOG_LEVEL: string = process.env.LOG_LEVEL || 'info';
  public readonly LOG_FILE: string = process.env.LOG_FILE || 'app.log';

  // Rate Limiting
  public readonly RATE_LIMIT_WINDOW: number = parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10); // 15 minutes
  public readonly RATE_LIMIT_MAX: number = parseInt(process.env.RATE_LIMIT_MAX || '100', 10);

  // Application Secrets
  public readonly APP_SECRET: string = process.env.APP_SECRET || 'your-app-secret';
  public readonly ENCRYPTION_KEY: string = process.env.ENCRYPTION_KEY || 'your-encryption-key';

  constructor() {
    this.validateRequiredEnvs();
  }

  /**
   * Validates that all required environment variables are set
   */
  private validateRequiredEnvs(): void {
    const requiredEnvs = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET', 'COOKIE_SECRET', 'DB_HOST', 'DB_NAME', 'DB_USER'];

    const missingEnvs = requiredEnvs.filter(env => !process.env[env]);

    if (missingEnvs.length > 0) {
      console.warn(`⚠️  Missing environment variables: ${missingEnvs.join(', ')}`);
      console.warn('⚠️  Using default values. Please set these in your .env file for production.');
    }
  }

  /**
   * Get database connection string
   */
  public getDatabaseUrl(): string {
    return `${this.DB_DIALECT}://${this.DB_USER}:${this.DB_PASSWORD}@${this.DB_HOST}:${this.DB_PORT}/${this.DB_NAME}`;
  }

  /**
   * Check if running in production
   */
  public isProduction(): boolean {
    return this.NODE_ENV === 'production';
  }

  /**
   * Check if running in development
   */
  public isDevelopment(): boolean {
    return this.NODE_ENV === 'development';
  }

  /**
   * Check if running in test environment
   */
  public isTest(): boolean {
    return this.NODE_ENV === 'test';
  }

  /**
   * Get full API base path
   */
  public getApiBasePath(): string {
    return `${this.API_PREFIX}/${this.API_VERSION}`;
  }

  /**
   * Get server URL
   */
  public getServerUrl(): string {
    return `http://${this.HOST}:${this.PORT}`;
  }

  /**
   * Print current environment configuration (for debugging)
   */
  public printConfig(): void {
    console.log('🔧 Environment Configuration:-');
    console.log(`   NODE_ENV: ${this.NODE_ENV}`);
    console.log(`   Server: ${this.getServerUrl()}`);
    console.log(`   API Base: ${this.getApiBasePath()}`);
    // console.log(`   Database: ${this.DB_HOST}:${this.DB_PORT}/${this.DB_NAME}`);
    // console.log(`   JWT Secret: ${this.JWT_SECRET ? '***' : 'NOT SET'}`);
  }
}

// Create and export a singleton instance
const Env = new EnvConfig();

// Initialize environment on import
console.log('✅ Environment configuration loaded successfully');

export default Env;

// Export the instance as both named and default export for flexibility
export { Env };
