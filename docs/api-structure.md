# API Structure Documentation

## Overview

The Midora AI frontend has been restructured to follow a modular API architecture with proper separation of concerns, configuration management, and internationalization support.

## Architecture

### 1. Configuration Management (`/src/config/`)

#### `app.ts`
Centralized configuration management for the entire application.

**Features:**
- Environment variable management
- Feature flags
- Authentication settings
- UI configuration
- Validation functions

**Usage:**
```typescript
import { appConfig, apiConfig, authConfig } from '@/config/app'

// Access configuration
const backendUrl = appConfig.backendUrl
const isGoogleAuthEnabled = appConfig.features.enableGoogleAuth
```

### 2. API Structure (`/src/api/`)

#### Base API Client (`/src/api/base.ts`)
Foundation for all API interactions with:
- HTTP methods (GET, POST, PUT, DELETE)
- Automatic timeout handling
- Error management
- Request/response interceptors

#### Interceptors (`/src/api/interceptors.ts`)
Automatic request/response processing:
- Authorization header injection
- Backend API detection
- Error handling
- Request/response logging

#### Authentication API (`/src/api/auth/`)
- `api.ts`: Authentication API client
- `types.ts`: Authentication-specific types

**Usage:**
```typescript
import { authApi } from '@/api/auth/api'
import { UserLogin, UserCreate } from '@/api/auth/types'

// Login user
const response = await authApi.login({ email, password })

// Register user
const response = await authApi.register(userData)
```

### 3. Internationalization (`/src/i18n/`)

Modular i18n implementation with separate language files.

**Structure:**
```
src/i18n/
├── index.ts                    # Main i18n configuration
└── languages/
    └── en/                     # English translations
        ├── index.ts           # Main English index
        ├── common.ts          # Common terms
        ├── auth.ts            # Authentication
        ├── navigation.ts      # Navigation
        ├── chat.ts            # Chat interface
        ├── errors.ts          # Error messages
        └── success.ts         # Success messages
```

**Features:**
- Modular translation files
- Parameter substitution
- Language switching
- Type-safe translations
- Easy to add new languages

**Usage:**
```typescript
import { t, tWithParams } from '@/i18n'

// Simple translation
const title = t('auth.welcomeBack')

// Translation with parameters
const message = tWithParams('chat.stepOfWelcome', { step: 1 })
```

### 4. Frontend Route Middleware (`/middleware.ts`)

Simplified middleware that only checks for access token presence.

**Features:**
- Route protection
- Token presence validation
- Automatic redirects
- Security headers

## Environment Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Application Configuration
NEXT_PUBLIC_APP_NAME=Midora AI
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=development

# Backend API Configuration
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_TIMEOUT=30000

# Authentication Configuration
NEXT_PUBLIC_ACCESS_TOKEN_EXPIRY=900

# Feature Flags
NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=false
NEXT_PUBLIC_ENABLE_TWO_FACTOR=false
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# UI Configuration
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
NEXT_PUBLIC_SUPPORTED_LANGUAGES=en
NEXT_PUBLIC_DEFAULT_THEME=system
```

### Configuration Guide

1. **Copy the example file:**
   ```bash
   cp env.example .env.local
   ```

2. **Update the values:**
   - Set your backend URL
   - Configure authentication settings
   - Enable/disable features as needed

3. **Restart the development server:**
   ```bash
   npm run dev
   ```

## API Usage Examples

### Creating a New API Module

1. **Create the types file:**
   ```typescript
   // /src/api/your-module/types.ts
   export interface YourRequest {
     field: string
   }
   
   export interface YourResponse {
     result: string
   }
   ```

2. **Create the API client:**
   ```typescript
   // /src/api/your-module/api.ts
   import { baseApiClient } from '../base'
   import { YourRequest, YourResponse } from './types'
   
   class YourApiClient {
     async getData(request: YourRequest) {
       return baseApiClient.post<YourResponse>('/api/your-endpoint', request)
     }
   }
   
   export const yourApi = new YourApiClient()
   ```

3. **Use in components:**
   ```typescript
   import { yourApi } from '@/api/your-module/api'
   
   const response = await yourApi.getData({ field: 'value' })
   ```

### Adding New Translations

1. **Create a new translation file:**
   ```typescript
   // /src/i18n/languages/en/yourModule.ts
   export const yourModule = {
     title: 'Your Title',
     description: 'Your Description',
   }
   ```

2. **Add to the main English index:**
   ```typescript
   // /src/i18n/languages/en/index.ts
   import { yourModule } from './yourModule'
   
   export const enTranslations = {
     common,
     auth,
     navigation,
     chat,
     errors,
     success,
     yourModule, // Add your new module
   }
   ```

3. **Use in components:**
   ```typescript
   import { t } from '@/i18n'
   
   const title = t('yourModule.title')
   ```

## Security Features

### Automatic Authorization
- Access tokens are automatically added to backend API requests
- Only applies to requests to the configured backend URL
- Uses fixed cookie names: `midora_access_token`, `midora_refresh_token`, `midora_user_data`
- Handles token refresh automatically

### Route Protection
- Middleware checks for access token presence
- Redirects unauthenticated users to login
- Preserves return URL for post-login redirect

### Cookie Security
- Fixed cookie names for consistency
- Secure cookie configuration
- HTTP-only cookies in production
- SameSite protection
- Configurable expiration times

## Best Practices

### API Development
1. **Separate concerns:** Keep types and API logic separate
2. **Use the base client:** Always use `baseApiClient` for consistency
3. **Handle errors:** Implement proper error handling
4. **Type safety:** Use TypeScript interfaces for all API data

### Configuration
1. **Environment variables:** Use `NEXT_PUBLIC_` prefix for client-side variables
2. **Feature flags:** Use configuration for feature toggles
3. **Validation:** Validate configuration on startup

### Internationalization
1. **Consistent keys:** Use dot notation for nested translations
2. **Parameter substitution:** Use `tWithParams` for dynamic content
3. **Type safety:** Define translation interfaces

### Security
1. **Token management:** Let interceptors handle authorization
2. **Route protection:** Use middleware for protected routes
3. **Error handling:** Don't expose sensitive information in errors

## Troubleshooting

### Common Issues

1. **Configuration not loading:**
   - Check environment variable names
   - Ensure `NEXT_PUBLIC_` prefix for client-side variables
   - Restart the development server

2. **API calls failing:**
   - Verify backend URL configuration
   - Check network connectivity
   - Review browser console for errors

3. **Translations not working:**
   - Ensure translation keys exist
   - Check for typos in key names
   - Verify i18n initialization

4. **Middleware issues:**
   - Check route patterns
   - Verify cookie names
   - Review middleware configuration

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

This will provide detailed console logs for:
- API requests/responses
- Configuration loading
- Translation lookups
- Middleware decisions

## Migration Guide

### From Old Structure

1. **Update imports:**
   ```typescript
   // Old
   import { backendApi } from '@/lib/backend-api'
   import { UserLogin } from '@/types/auth'
   
   // New
   import { authApi } from '@/api/auth/api'
   import { UserLogin } from '@/api/auth/types'
   ```

2. **Update API calls:**
   ```typescript
   // Old
   const response = await backendApi.login(credentials)
   
   // New
   const response = await authApi.login(credentials)
   ```

3. **Update configuration:**
   ```typescript
   // Old
   const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
   
   // New
   import { appConfig } from '@/config/app'
   const backendUrl = appConfig.backendUrl
   ```

4. **Update translations:**
   ```typescript
   // Old
   const title = 'Welcome Back'
   
   // New
   import { t } from '@/i18n'
   const title = t('auth.welcomeBack')
   ```

## Future Enhancements

- [ ] Add more API modules (chat, conversations, etc.)
- [ ] Implement advanced i18n features (pluralization, date formatting)
- [ ] Add API response caching
- [ ] Implement request/response logging
- [ ] Add API rate limiting
- [ ] Implement offline support
- [ ] Add API documentation generation
