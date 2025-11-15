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

## Scripts

```bash
# create a env file and copy the env from env.example

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
