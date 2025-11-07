# Environment Configuration System

This project uses a centralized environment configuration system that automatically loads and validates all environment variables.

## Usage

### 1. Basic Usage

Import and use `Env` anywhere in your application:

```typescript
import Env from './common/config/build_env.js';

// Use any environment variable
const port = Env.PORT;
const dbHost = Env.DB_HOST;
const jwtSecret = Env.JWT_SECRET;

// Use helper methods
const isProduction = Env.isProduction();
const apiBasePath = Env.getApiBasePath();
const serverUrl = Env.getServerUrl();
```

### 2. Available Commands

```bash
# Initialize and check environment configuration
npm run create_env

# Check current environment configuration
npm run env:check

# Validate environment variables
npm run env:validate
```

### 3. Environment Variables

All environment variables are defined in `.env` file. Key variables include:

#### Server Configuration
- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: localhost)
- `NODE_ENV` - Environment (development/production/test)

#### Database Configuration
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password

#### JWT Configuration
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - JWT expiration time
- `JWT_REFRESH_SECRET` - Refresh token secret
- `JWT_REFRESH_EXPIRES_IN` - Refresh token expiration

### 4. Examples

#### In your server file:
```typescript
import Env from './common/config/build_env.js';

const server = Hapi.server({
  port: Env.PORT,
  host: Env.HOST
});
```

#### In a database utility:
```typescript
import Env from '../config/build_env.js';

const dbConfig = {
  host: Env.DB_HOST,
  port: Env.DB_PORT,
  database: Env.DB_NAME,
  username: Env.DB_USER,
  password: Env.DB_PASSWORD
};
```

#### In a JWT utility:
```typescript
import Env from '../config/build_env.js';
import jwt from 'jsonwebtoken';

const token = jwt.sign(payload, Env.JWT_SECRET, {
  expiresIn: Env.JWT_EXPIRES_IN
});
```

### 5. Features

- ✅ **Automatic Loading**: Environment variables are loaded automatically when imported
- ✅ **Type Safety**: All variables are properly typed
- ✅ **Validation**: Required variables are validated on startup
- ✅ **Default Values**: Sensible defaults for development
- ✅ **Helper Methods**: Utility methods for common operations
- ✅ **Environment Detection**: Easy environment checking methods
- ✅ **Centralized**: Single source of truth for all environment configuration

### 6. Best Practices

1. **Always use `Env.VARIABLE_NAME`** instead of `process.env.VARIABLE_NAME`
2. **Never commit `.env` file** to version control
3. **Set all required variables** in production environment
4. **Use the validation commands** to check configuration
5. **Import once**: The configuration is loaded once and cached

### 7. Production Setup

1. Copy `.env.example` to `.env`
2. Set all required environment variables
3. Run `npm run env:validate` to check configuration
4. Deploy with proper environment variables set

This system eliminates the need to call `dotenv.config()` everywhere and provides a clean, type-safe interface for accessing environment variables throughout your application.