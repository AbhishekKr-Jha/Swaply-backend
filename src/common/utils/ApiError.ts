export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintain proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }

    this.name = this.constructor.name;
  }

  // Static methods for common error types
  static badRequest(message = 'Bad Request'): ApiError {
    return new ApiError(message, 400);
  }

  static unauthorized(message = 'Unauthorized'): ApiError {
    return new ApiError(message, 401);
  }

  static forbidden(message = 'Forbidden'): ApiError {
    return new ApiError(message, 403);
  }

  static notFound(message = 'Not Found'): ApiError {
    return new ApiError(message, 404);
  }

  static conflict(message = 'Conflict'): ApiError {
    return new ApiError(message, 409);
  }

  static internal(message = 'Internal Server Error'): ApiError {
    return new ApiError(message, 500);
  }

  static validationError(message = 'Validation Error'): ApiError {
    return new ApiError(message, 422);
  }
}
