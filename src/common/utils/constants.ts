// HTTP Status Codes
export const statusCodes = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  TOO_MANY_REQUESTS: 429,

  // Server Errors
  SERVER_ISSUE: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// Application Constants
export const appConstants = {
  // JWT Token Types
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',

  // Token Expiry Times
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',

  // Cookie Names
  ACCESS_TOKEN_COOKIE: 'accessToken',
  REFRESH_TOKEN_COOKIE: 'refreshToken',

  // Rate Limiting
  DEFAULT_RATE_LIMIT: 100,
  DEFAULT_RATE_WINDOW: 15 * 60 * 1000, // 15 minutes

  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,

  // File Upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],

  // Database
  DEFAULT_DB_LIMIT: 50,
} as const;

// API Messages
export const apiMessages = {
  // Authentication
  INVALID_CREDENTIALS: 'Invalid credentials provided',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token provided',
  ACCESS_DENIED: 'Access denied',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',

  // User Management
  USER_NOT_FOUND: 'User not found',
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  USER_ALREADY_EXISTS: 'User already exists',

  // General
  OPERATION_SUCCESS: 'Operation completed successfully',
  OPERATION_FAILED: 'Operation failed',
  INVALID_REQUEST: 'Invalid request',
  SERVER_ERROR: 'Internal server error',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',

  // Database
  DB_CONNECTION_ERROR: 'Database connection error',
  DB_OPERATION_FAILED: 'Database operation failed',
} as const;

// Environment Types
export const environments = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
  STAGING: 'staging',
} as const;

export type StatusCode = (typeof statusCodes)[keyof typeof statusCodes];
export type AppConstant = (typeof appConstants)[keyof typeof appConstants];
export type ApiMessage = (typeof apiMessages)[keyof typeof apiMessages];
export type Environment = (typeof environments)[keyof typeof environments];
