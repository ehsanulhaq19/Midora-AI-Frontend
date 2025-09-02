# API Documentation

This document provides comprehensive documentation for all API endpoints in the Midora AI Frontend application.

## 🚀 Overview

The application provides a RESTful API with the following features:
- **JSON responses** with consistent structure
- **Error handling** with proper HTTP status codes
- **Input validation** using Zod schemas
- **Health monitoring** endpoints
- **Rate limiting** (configurable)
- **CORS support** for cross-origin requests

## 📡 Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## 🔧 API Configuration

### Environment Variables
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
API_RATE_LIMIT=100          # Requests per minute
API_TIMEOUT=10000           # Timeout in milliseconds
API_CORS_ORIGIN=*           # CORS origin
```

### Headers
All API requests should include:
```http
Content-Type: application/json
Accept: application/json
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {},
  "timestamp": "2024-12-01T10:00:00.000Z",
  "statusCode": 200
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information",
  "timestamp": "2024-12-01T10:00:00.000Z",
  "statusCode": 400
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2024-12-01T10:00:00.000Z",
  "statusCode": 200
}
```

## 🏥 Health Check Endpoints

### GET /api/health

Returns the application health status and system information.

**URL**: `/api/health`  
**Method**: `GET`  
**Authentication**: Not required

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-12-01T10:00:00.000Z",
  "uptime": 3600.5,
  "environment": "production",
  "version": "0.1.0"
}
```

**Status Codes**:
- `200 OK` - Application is healthy
- `500 Internal Server Error` - Application is unhealthy

**Use Cases**:
- Docker health checks
- Load balancer health monitoring
- System monitoring dashboards
- DevOps automation

## 👋 Hello API Endpoints

### GET /api/hello

Returns a simple greeting message.

**URL**: `/api/hello`  
**Method**: `GET`  
**Authentication**: Not required

**Response**:
```json
{
  "message": "Hello from Midora AI Frontend!",
  "timestamp": "2024-12-01T10:00:00.000Z",
  "status": "success"
}
```

**Status Codes**:
- `200 OK` - Request successful

**Use Cases**:
- API connectivity testing
- Development debugging
- Health monitoring

### POST /api/hello

Accepts data and returns a confirmation message.

**URL**: `/api/hello`  
**Method**: `POST`  
**Authentication**: Not required

**Request Body**:
```json
{
  "name": "John Doe",
  "message": "Hello World"
}
```

**Response**:
```json
{
  "message": "Data received successfully!",
  "receivedData": {
    "name": "John Doe",
    "message": "Hello World"
  },
  "timestamp": "2024-12-01T10:00:00.000Z",
  "status": "success"
}
```

**Status Codes**:
- `200 OK` - Data received successfully
- `400 Bad Request` - Invalid request body

**Validation**:
- Request body must be valid JSON
- No specific field validation required

## 🔐 Authentication Endpoints

### POST /api/auth/login

Authenticate a user and return access token.

**URL**: `/api/auth/login`  
**Method**: `POST`  
**Authentication**: Not required

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  },
  "timestamp": "2024-12-01T10:00:00.000Z",
  "statusCode": 200
}
```

**Status Codes**:
- `200 OK` - Login successful
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Invalid credentials
- `500 Internal Server Error` - Server error

**Validation**:
```typescript
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
```

### POST /api/auth/register

Register a new user account.

**URL**: `/api/auth/register`  
**Method**: `POST`  
**Authentication**: Not required

**Request Body**:
```json
{
  "email": "newuser@example.com",
  "password": "securepassword123",
  "confirmPassword": "securepassword123",
  "name": "New User",
  "acceptTerms": true
}
```

**Response**:
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "user_456",
      "email": "newuser@example.com",
      "name": "New User",
      "role": "user"
    }
  },
  "timestamp": "2024-12-01T10:00:00.000Z",
  "statusCode": 201
}
```

**Status Codes**:
- `201 Created` - Registration successful
- `400 Bad Request` - Invalid input or validation error
- `409 Conflict` - User already exists
- `500 Internal Server Error` - Server error

**Validation**:
```typescript
const registrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})
```

### POST /api/auth/logout

Logout the current user.

**URL**: `/api/auth/logout`  
**Method**: `POST`  
**Authentication**: Required (Bearer token)

**Headers**:
```http
Authorization: Bearer <access_token>
```

**Response**:
```json
{
  "success": true,
  "message": "Logout successful",
  "timestamp": "2024-12-01T10:00:00.000Z",
  "statusCode": 200
}
```

**Status Codes**:
- `200 OK` - Logout successful
- `401 Unauthorized` - Invalid or missing token
- `500 Internal Server Error` - Server error

## 👤 User Management Endpoints

### GET /api/users/profile

Get the current user's profile.

**URL**: `/api/users/profile`  
**Method**: `GET`  
**Authentication**: Required (Bearer token)

**Headers**:
```http
Authorization: Bearer <access_token>
```

**Response**:
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "Software developer",
    "isActive": true,
    "emailVerified": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-12-01T10:00:00.000Z"
  },
  "timestamp": "2024-12-01T10:00:00.000Z",
  "statusCode": 200
}
```

**Status Codes**:
- `200 OK` - Profile retrieved successfully
- `401 Unauthorized` - Invalid or missing token
- `500 Internal Server Error` - Server error

### PUT /api/users/profile

Update the current user's profile.

**URL**: `/api/users/profile`  
**Method**: `PUT`  
**Authentication**: Required (Bearer token)

**Headers**:
```http
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "name": "Updated Name",
  "bio": "Updated bio information"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user_123",
    "name": "Updated Name",
    "bio": "Updated bio information",
    "updatedAt": "2024-12-01T10:00:00.000Z"
  },
  "timestamp": "2024-12-01T10:00:00.000Z",
  "statusCode": 200
}
```

**Status Codes**:
- `200 OK` - Profile updated successfully
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Invalid or missing token
- `500 Internal Server Error` - Server error

**Validation**:
```typescript
const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
})
```

## 📁 File Management Endpoints

### POST /api/files/upload

Upload a file to the system.

**URL**: `/api/files/upload`  
**Method**: `POST`  
**Authentication**: Required (Bearer token)

**Headers**:
```http
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body**:
```form-data
file: <file>
description: "File description"
tags: "tag1,tag2"
```

**Response**:
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": "file_123",
    "name": "document.pdf",
    "size": 1024000,
    "type": "application/pdf",
    "url": "https://example.com/files/document.pdf",
    "uploadedAt": "2024-12-01T10:00:00.000Z",
    "uploadedBy": "user_123"
  },
  "timestamp": "2024-12-01T10:00:00.000Z",
  "statusCode": 201
}
```

**Status Codes**:
- `201 Created` - File uploaded successfully
- `400 Bad Request` - Invalid file or metadata
- `401 Unauthorized` - Invalid or missing token
- `413 Payload Too Large` - File too large
- `500 Internal Server Error` - Server error

**Validation**:
- File size limit: 10MB
- Allowed types: images, PDFs, documents, text files
- Required fields: file

## 🔍 Search and Filter Endpoints

### GET /api/search

Search across multiple content types.

**URL**: `/api/search`  
**Method**: `GET`  
**Authentication**: Not required

**Query Parameters**:
```
?query=search+term
&type=user,file,content
&page=1
&limit=10
&sortBy=relevance
&sortOrder=desc
```

**Response**:
```json
{
  "success": true,
  "message": "Search completed successfully",
  "data": [
    {
      "id": "result_1",
      "type": "user",
      "title": "John Doe",
      "description": "Software developer",
      "relevance": 0.95
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2024-12-01T10:00:00.000Z",
  "statusCode": 200
}
```

**Status Codes**:
- `200 OK` - Search completed successfully
- `400 Bad Request` - Invalid search parameters
- `500 Internal Server Error` - Server error

## 🚨 Error Handling

### HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request or validation error |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | Access denied |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict |
| 413 | Payload Too Large | Request body too large |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Error Response Structure

```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Detailed error information",
  "errors": {
    "email": ["Invalid email format"],
    "password": ["Password too short"]
  },
  "timestamp": "2024-12-01T10:00:00.000Z",
  "statusCode": 422
}
```

### Common Error Messages

- `"Invalid email address"` - Email format validation failed
- `"Password too short"` - Password length validation failed
- `"User not found"` - User ID doesn't exist
- `"Access denied"` - Insufficient permissions
- `"Rate limit exceeded"` - Too many requests
- `"Server error"` - Internal server error

## 🚦 Rate Limiting

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Rate Limit Configuration

- **Default**: 100 requests per minute
- **Burst**: 10 requests per second
- **Window**: 1 minute sliding window

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "message": "Rate limit exceeded",
  "error": "Too many requests. Please try again later.",
  "retryAfter": 60,
  "timestamp": "2024-12-01T10:00:00.000Z",
  "statusCode": 429
}
```

## 🔒 Security

### Authentication

- **JWT tokens** for stateless authentication
- **Bearer token** in Authorization header
- **Token expiration** with refresh mechanism
- **Secure token storage** recommendations

### CORS Configuration

```typescript
const corsOptions = {
  origin: process.env.API_CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}
```

### Input Validation

- **Zod schemas** for request validation
- **Sanitization** of user inputs
- **Type checking** for all parameters
- **Length limits** for text fields

## 📊 Monitoring and Logging

### Health Metrics

- **Response time** tracking
- **Error rate** monitoring
- **Request volume** statistics
- **System resource** usage

### Logging

- **Request/response** logging
- **Error logging** with stack traces
- **Performance metrics** logging
- **Audit trail** for sensitive operations

## 🧪 Testing

### API Testing

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test hello endpoint
curl http://localhost:3000/api/hello

# Test with authentication
curl -H "Authorization: Bearer <token>" \
     http://localhost:3000/api/users/profile
```

### Test Data

```json
{
  "testUser": {
    "email": "test@example.com",
    "password": "testpassword123",
    "name": "Test User"
  },
  "testFile": {
    "name": "test.txt",
    "content": "Hello World"
  }
}
```

## 📚 SDK and Libraries

### JavaScript/TypeScript

```typescript
import { api } from '@/lib/api'

// Make API calls
const response = await api.get('/users/profile')
const user = await api.post('/auth/login', credentials)
```

### cURL Examples

```bash
# Health check
curl -X GET http://localhost:3000/api/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

## 🔄 API Versioning

### Version Strategy

- **URL versioning**: `/api/v1/`, `/api/v2/`
- **Header versioning**: `Accept: application/vnd.api.v1+json`
- **Query parameter**: `?version=1`

### Current Version

- **Version**: v1
- **Status**: Stable
- **Deprecation**: None planned

## 📈 Performance

### Response Times

- **Health check**: < 50ms
- **Simple queries**: < 100ms
- **Complex operations**: < 500ms
- **File uploads**: Variable based on file size

### Optimization

- **Response caching** for static data
- **Database indexing** for queries
- **Connection pooling** for database
- **CDN integration** for static assets

---

**Last Updated**: December 2024  
**Version**: 0.1.0  
**Maintainer**: Midora AI Team
