# Token Management Strategy

## Overview

This document outlines the recommended approach for handling access and refresh tokens in the Midora AI frontend application. We implement a **hybrid strategy** that combines the security benefits of both localStorage and HttpOnly cookies.

## 🏆 **Recommended Approach: Hybrid Strategy**

### **Access Tokens: localStorage**
- **Storage**: localStorage
- **Expiration**: Short-lived (15-30 minutes)
- **Security**: Protected by HTTPS and proper token validation
- **Usage**: Included in API requests via interceptors

### **Refresh Tokens: HttpOnly Cookies**
- **Storage**: HttpOnly cookies (handled by backend)
- **Expiration**: Long-lived (7-30 days)
- **Security**: Protected from XSS attacks
- **Usage**: Automatically sent to server for token refresh

## 🔧 **Implementation Details**

### **Token Manager (`/src/lib/token-manager.ts`)**

The `TokenManager` class provides a centralized way to handle token storage and retrieval:

```typescript
// Store tokens
tokenManager.storeTokens(accessToken, refreshToken, authMethod)

// Get access token
const accessToken = tokenManager.getAccessToken()

// Check if tokens are valid
const isValid = tokenManager.hasValidTokens()

// Clear all tokens
tokenManager.clearTokens()
```

### **API Interceptors (`/src/api/interceptors.ts`)**

The API interceptors handle basic token management and request authentication:

```typescript
// Automatically adds auth headers to requests
// Basic response processing
// Error handling
```

## 🔒 **Security Considerations**

### **XSS Protection**
- **Access tokens**: Stored in localStorage (vulnerable to XSS)
- **Refresh tokens**: Stored in HttpOnly cookies (protected from XSS)
- **Mitigation**: Implement Content Security Policy (CSP) and sanitize user inputs

### **CSRF Protection**
- **Access tokens**: Not automatically sent (no CSRF risk)
- **Refresh tokens**: Sent automatically (potential CSRF risk)
- **Mitigation**: Use SameSite cookie attribute and CSRF tokens

### **Token Expiration**
- **Access tokens**: Short expiration (15-30 minutes)
- **Refresh tokens**: Longer expiration (7-30 days)
- **Backend refresh**: Backend handles token refresh automatically

## 📋 **Backend Requirements**

For optimal security, the backend should implement:

### **Refresh Token Cookie Settings**
```python
# Example for FastAPI
response.set_cookie(
    key="refresh_token",
    value=refresh_token,
    httponly=True,        # Prevent XSS
    secure=True,          # HTTPS only
    samesite="strict",    # Prevent CSRF
    max_age=7*24*60*60   # 7 days
)
```

### **Token Refresh Endpoint**
```python
@router.post("/auth/refresh")
async def refresh_token(request: Request):
    # Get refresh token from HttpOnly cookie
    refresh_token = request.cookies.get("refresh_token")
    
    # Validate and refresh
    new_tokens = validate_and_refresh(refresh_token)
    
    # Set new refresh token cookie
    response.set_cookie(...)
    
    return {"access_token": new_tokens.access_token}
```

## 🚀 **Migration Strategy**

### **Phase 1: Current Implementation (localStorage)**
- ✅ Access tokens in localStorage
- ✅ Refresh tokens in localStorage (fallback)
- ✅ Basic token management

### **Phase 2: Hybrid Implementation (Recommended)**
- 🔄 Access tokens in localStorage
- 🔄 Refresh tokens in HttpOnly cookies
- 🔄 Enhanced security features

### **Phase 3: Full Cookie Implementation (Optional)**
- 🔄 All tokens in HttpOnly cookies
- 🔄 Server-side session management
- 🔄 Maximum security

## 📊 **Comparison Table**

| Feature | localStorage | HttpOnly Cookies | Hybrid |
|---------|-------------|------------------|---------|
| **XSS Protection** | ❌ | ✅ | ⚠️ Partial |
| **CSRF Protection** | ✅ | ❌ | ⚠️ Partial |
| **Automatic Expiration** | ❌ | ✅ | ✅ |
| **Size Limit** | 5-10MB | 4KB | ✅ |
| **Implementation Complexity** | ✅ Simple | ❌ Complex | ⚠️ Medium |
| **SPA Compatibility** | ✅ | ⚠️ | ✅ |

## 🛠️ **Usage Examples**

### **Storing Tokens**
```typescript
// After successful authentication
const { accessToken, refreshToken } = await authApi.login(credentials)
tokenManager.storeTokens(accessToken, refreshToken, 'email')
```

### **Making Authenticated Requests**
```typescript
// Tokens are automatically included via interceptors
const response = await apiClient.get('/protected-endpoint')
```

### **Handling Token Refresh**
```typescript
// Backend handles token refresh automatically
// Frontend just needs to handle 401 responses appropriately
// Redirect to login if refresh fails
```

### **Logout**
```typescript
// Clear all tokens
tokenManager.clearTokens()
// Backend should also clear refresh token cookie
```

## 🔍 **Monitoring and Debugging**

### **Token Validation**
```typescript
// Check if access token is expired
const isExpired = tokenManager.isAccessTokenExpired()

// Check if user has valid tokens
const hasValidTokens = tokenManager.hasValidTokens()
```

### **Debug Information**
```typescript
// Get all stored tokens (for debugging)
const tokens = tokenManager.getTokens()
console.log('Stored tokens:', tokens)
```

## 🚨 **Error Handling**

### **Token Refresh Failures**
- Clear all stored tokens
- Redirect to login page
- Show appropriate error message

### **Network Errors**
- Retry with exponential backoff
- Handle offline scenarios
- Provide user feedback

## 📈 **Performance Considerations**

### **Token Refresh Strategy**
- **Backend Managed**: Server handles all token refresh logic
- **Frontend Simple**: Just handles 401 responses appropriately
- **Automatic**: No manual refresh needed on frontend

### **Storage Optimization**
- Use efficient serialization
- Implement token compression if needed
- Monitor storage usage

## 🔮 **Future Enhancements**

1. **JWT Validation**: Client-side token validation
2. **Token Rotation**: Regular refresh token rotation
3. **Multi-Device Support**: Device-specific tokens
4. **Offline Support**: Cached authentication state
5. **Biometric Authentication**: Enhanced security

## 📚 **References**

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [HTTP-Only Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies)
- [SameSite Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)

## 🎯 **Recommendation**

For the Midora AI application, we recommend implementing the **Hybrid Strategy**:

1. **Immediate**: Use the current localStorage implementation
2. **Short-term**: Implement HttpOnly cookies for refresh tokens
3. **Long-term**: Consider full cookie-based authentication

This approach provides a good balance between security and implementation complexity while maintaining excellent user experience.
