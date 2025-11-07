import Cookie from '@hapi/cookie';
import Hapi from '@hapi/hapi';
import Jwt from '@hapi/jwt';
import jwt from 'jsonwebtoken';
import Env from './common/config/build_env.js';
import { connectDB, db } from './common/config/db.js';
import { ApiError } from './common/utils/ApiError.js';
import { statusCodes } from './common/utils/constants.js';
import routesPlugin from './plugins/routes.plugin.js';
import { registerSwagger } from './plugins/swagger.plugin.js';

const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret) as { userId: string; roleId?: string };
  } catch (_err) {
    console.log(_err);
    throw new ApiError('Invalid or expired token', statusCodes.UNAUTHORIZED);
  }
};

const validateAccess = async (req: Hapi.Request, token: string) => {
  try {
    if (!token) {
      throw new ApiError('No accessToken found in Cookie!', statusCodes.UNAUTHORIZED);
    }

    const accessSecret = Env.JWT_ACCESS_SECRET;
    if (!accessSecret) {
      throw new ApiError('Access Secret is not found in environment!', statusCodes.UNAUTHORIZED);
    }

    const decoded = verifyToken(token, accessSecret) as any;

    const user = await db.User.findOne({
      where: { id: decoded?.userId },
    });

    if (!user) {
      throw new ApiError('User not found!', statusCodes.UNAUTHORIZED);
    }

    return {
      isValid: true,
      credentials: { userId: decoded?.userId, roleId: decoded?.roleId },
    };
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Internal server error at validate-access!', statusCodes.SERVER_ISSUE);
  }
};

const validateRefresh = async (req: Hapi.Request) => {
  try {
    const token = req.state.refreshToken;
    if (!token) {
      throw new ApiError('No refreshToken found in Cookie!', statusCodes.UNAUTHORIZED);
    }

    const refreshSecret = Env.JWT_REFRESH_SECRET;
    if (!refreshSecret) {
      throw new ApiError('Refresh Secret not found in environment!', statusCodes.UNAUTHORIZED);
    }

    const decoded = verifyToken(token, refreshSecret) as any;

    const refreshToken = (await db.RefreshToken.findOne({
      where: { token, userId: decoded.userId },
    })) as any;

    if (!refreshToken || refreshToken.get('expiresAt') < new Date()) {
      throw new ApiError('Invalid or expired refresh token!', statusCodes.UNAUTHORIZED);
    }

    const user = await db.User.findOne({
      where: { id: decoded.userId },
    });

    if (!user || !user.get('isActive')) {
      throw new ApiError('User not found or inactive!', statusCodes.UNAUTHORIZED);
    }

    return {
      isValid: true,
      credentials: { userId: decoded?.userId, roleId: decoded?.roleId },
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Internal server error at validate-refresh!', statusCodes.SERVER_ISSUE);
  }
};

const init = async () => {
  const server = Hapi.server({
    port: Env.PORT,
    host: Env.HOST,
    routes: {
      cors: {
        origin: [Env.CORS_ORIGIN],
        credentials: true,
        additionalHeaders: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match', 'X-Skip-Loader'],
      },
      state: {
        parse: true,
        failAction: 'error',
      },
      payload: {
        output: 'stream',
        parse: true,
        multipart: true,
        maxBytes: 1024 * 1024 * 10, // 10MB
      },
    },
  });

  // Register plugins
  await server.register(Jwt);
  await server.register(Cookie);
  await registerSwagger(server);

  // JWT Access Token Strategy (Cookie-based)
  server.auth.strategy('jwt_access', 'cookie', {
    cookie: {
      name: 'accessToken',
      password: Env.COOKIE_SECRET,
      isHttpOnly: true,
      ttl: 15 * 60 * 1000, // 15 minutes
      path: '/',
      domain: Env.isDevelopment() ? undefined : Env.COOKIE_DOMAIN,
      isSecure: Env.isProduction() && Env.COOKIE_SECURE,
    },
    validate: validateAccess,
  });

  // Custom Refresh Token Strategy
  server.auth.scheme('custom-refresh', () => {
    return {
      authenticate: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
        try {
          const result = await validateRefresh(request);
          if (!result.isValid) {
            throw new ApiError('Refresh token validation failed', 401);
          }
          return h.authenticated({ credentials: result.credentials });
        } catch (error) {
          if (error instanceof ApiError) {
            return h.unauthenticated(error);
          }
          return h.unauthenticated(new ApiError('Authentication failed', 401));
        }
      },
    };
  });

  server.auth.strategy('jwt_refresh', 'custom-refresh');

  // Set default authentication strategy
  server.auth.default('jwt_access');

  // Global error handling
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;

    if (response instanceof Error) {
      if (response instanceof ApiError) {
        return h
          .response({
            error: response.message,
            statusCode: response.statusCode,
          })
          .code(response.statusCode);
      }

      // Generic error handling
      console.error('Unhandled error:', response);
      return h
        .response({
          error: 'Internal Server Error',
          statusCode: statusCodes.SERVER_ISSUE,
        })
        .code(statusCodes.SERVER_ISSUE);
    }

    return h.continue;
  });

  // Request logging
  server.events.on('response', req => {
    console.log(
      `${req.info.remoteAddress}: ${req.method.toUpperCase()} ${req.path} --> ${(req.response as any).statusCode}`,
    );
  });

  try {
    // Connect to database
    await connectDB();

    // Register routes
    await server.register(routesPlugin);

    // Start server
    await server.start();

    console.log(`🚀 Server is running on ${server.info.uri}`);
    console.log(`📚 Swagger documentation: ${server.info.uri}/documentation`);

    // Print environment configuration in development
    if (Env.isDevelopment()) {
      Env.printConfig();
    }
  } catch (error) {
    console.error('❌ Unable to connect to the database or start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Initialize the server
init();
