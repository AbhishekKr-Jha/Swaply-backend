# Hyperlocal Skill Exchange & Bartering Platform Project Backend

A complete backend server setup with JWT authentication, database integration,
and API documentation.

## Features

- ✅ **Hapi.js Framework** - Fast and secure web framework
- ✅ **JWT Authentication** - Access and refresh token implementation
- ✅ **Cookie-based Security** - Secure HTTP-only cookie handling
- ✅ **Database Integration** - Sequelize ORM with MySQL support
- ✅ **API Documentation** - Swagger documentation
- ✅ **Environment Management** - Centralized configuration
- ✅ **Error Handling** - Custom error classes and global error handling
- ✅ **TypeScript** - Full TypeScript support
- ✅ **CORS Support** - Cross-origin resource sharing
- ✅ **Request Logging** - Comprehensive request/response logging

## Project Structure

```
src/
├── server.ts                 # Main server entry point
├── common/
│   ├── config/
│   │   ├── build_env.ts      # Environment configuration
│   │   └── db.ts             # Database configuration
│   ├── utils/
│   │   ├── ApiError.ts       # Custom error handling
│   │   ├── constants.ts      # Application constants
│   │   ├── Jwt.ts           # JWT utilities
│   │   └── returnFunctions.ts #reusable response funtions
│   └── types/
│       └── env.d.ts          # TypeScript environment types
├── plugins/
│   ├── swagger.plugin.ts     # Swagger documentation setup
│   └── routes.plugin.ts      # API routes organization
└── models/                   # Database models (to be added)
```

## Environment Setup

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration:

   ```env
   # Required variables
   JWT_ACCESS_SECRET=your-super-secret-access-key-at-least-32-chars-long
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-at-least-32-chars-long
   COOKIE_SECRET=your-cookie-secret-must-be-at-least-32-chars-long-for-security

   # Database
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=resume_db
   DB_USER=root
   DB_PASSWORD=your_password_here

   # Server
   PORT=3000
   DEV_ORIGIN=http://localhost:5173
   ```

## Authentication Strategy

The server implements a dual-token authentication system:

1. **Access Token**: Short-lived (15 minutes), stored in HTTP-only cookie
2. **Refresh Token**: Long-lived (7 days), stored in HTTP-only cookie

### Authentication Flow

1. User logs in with credentials
2. Server generates access and refresh tokens
3. Tokens are stored in secure HTTP-only cookies
4. Access token is used for API authentication
5. When access token expires, refresh token generates a new access token with rotation

## Scripts

```bash
# env configure - centralized env setup
npm run create_env

# Development
npm run dev          # Start development server with hot reload

# Production
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server

# Environment
npm run env:check    # Check environment configuration
npm run env:validate # Validate required environment variables
```

## Development Server

Start the development server:

```bash
npm run dev
```

The server will start on `http://localhost:3000` with:

- API endpoints available at `/api/v1`
- Swagger documentation at `/documentation`
- Health check at `/api/v1/health`

## API Documentation

Access the interactive API documentation at:
`http://localhost:3000/documentation`

The Swagger UI provides:

- Interactive API testing
- Request/response schemas
- Authentication examples
- Comprehensive endpoint documentation

## Error Handling

The application uses a custom `ApiError` class for consistent error responses:

```typescript
// Example usage
throw new ApiError('User not found', 404);
throw ApiError.unauthorized('Invalid credentials');
throw ApiError.badRequest('Missing required fields');
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **HTTP-only Cookies**: Prevents XSS attacks
- **CORS Protection**: Configurable cross-origin policies
- **Request Validation**: Input validation with Joi
- **Environment Validation**: Required environment variables checking
- **Error Sanitization**: Safe error responses in production

## Database Management

The application automatically:

- Connects to the database on startup
- Synchronizes models in development mode
- Creates tables and relationships
- Handles database errors gracefully

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new files
3. Add appropriate error handling
4. Update API documentation for new endpoints
5. Test all changes in development environment

## License

This project is licensed under the ISC License.
