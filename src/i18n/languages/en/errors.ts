/**
 * English translations - Error messages
 * Maps backend error types to user-friendly messages
 */

export const errors = {
  // Authentication and Authorization Errors
  UNAUTHENTICATED: 'Please sign in to continue',
  UNAUTHORIZED: 'You do not have permission to access this resource',
  INVALID_TOKEN: 'Your session has expired. Please sign in again',
  TOKEN_EXPIRED: 'Your session has expired. Please sign in again',
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_DISABLED: 'Your account has been disabled. Please contact support',
  ACCOUNT_LOCKED: 'Your account has been temporarily locked. Please try again later',
  INSUFFICIENT_PERMISSIONS: 'You do not have sufficient permissions for this action',
  ROLE_NOT_FOUND: 'User role not found',
  USER_ROLE_NOT_FOUND: 'User role assignment not found',
  ROLE_ALREADY_ASSIGNED: 'This role is already assigned to the user',
  ROLE_ASSIGNMENT_FAILED: 'Failed to assign role to user',
  ROLE_REMOVAL_FAILED: 'Failed to remove role from user',
  ADMIN_ACCESS_REQUIRED: 'Administrator access is required for this action',
  USER_ACCESS_REQUIRED: 'User access is required for this action',
  DATA_ACCESS_DENIED: 'Access to this data is denied',
  OWNER_ACCESS_REQUIRED: 'Owner access is required for this action',

  // User Verification and Registration Errors
  NOT_VERIFIED_USER: 'Please verify your email address to continue',
  EMAIL_ALREADY_REGISTERED: 'An account with this email already exists',
  USER_NOT_FOUND: 'User account not found',
  INVALID_OTP: 'Invalid verification code. Please try again',
  OTP_EXPIRED: 'Verification code has expired. Please request a new one',
  OTP_ALREADY_VERIFIED: 'This verification code has already been used',
  EMAIL_VERIFICATION_REQUIRED: 'Please verify your email address',
  EMAIL_NOT_FOUND: 'No account found with this email address',
  PASSWORD_RESET_FAILED: 'Password reset failed. Please try again',
  INVALID_PASSWORD_RESET_TOKEN: 'Invalid or expired password reset link',

  // Conversation and Message Errors
  CONVERSATION_NOT_FOUND: 'Conversation not found',
  MESSAGE_NOT_FOUND: 'Message not found',
  CONVERSATION_ACCESS_DENIED: 'You do not have access to this conversation',
  MESSAGE_ACCESS_DENIED: 'You do not have access to this message',
  CONVERSATION_CREATION_FAILED: 'Failed to create conversation',
  MESSAGE_CREATION_FAILED: 'Failed to send message',
  CONVERSATION_DELETION_FAILED: 'Failed to delete conversation',
  MESSAGE_DELETION_FAILED: 'Failed to delete message',
  MESSAGE_UPDATE_FAILED: 'Failed to update message',
  INVALID_CONVERSATION_NAME: 'Invalid conversation name',
  INVALID_MESSAGE_CONTENT: 'Invalid message content',
  EMPTY_CONVERSATION_NAME: 'Conversation name cannot be empty',
  EMPTY_MESSAGE_CONTENT: 'Message content cannot be empty',
  CONVERSATION_NAME_TOO_LONG: 'Conversation name is too long',
  MESSAGE_CONTENT_TOO_LONG: 'Message content is too long',
  BOT_USER_CREATION_FAILED: 'Failed to create bot user',
  BOT_USER_NOT_FOUND: 'Bot user not found',
  CONVERSATION_UUID_REQUIRED: 'Conversation ID is required',
  INVALID_CONVERSATION_UUID: 'Invalid conversation ID',

  // Validation and Input Errors
  INVALID_INPUT: 'Invalid input provided',
  MISSING_REQUIRED_FIELD: 'Required field is missing',
  INVALID_EMAIL_FORMAT: 'Please enter a valid email address',
  INVALID_PASSWORD_FORMAT: 'Password format is invalid',
  PASSWORD_TOO_WEAK: 'Password is too weak. Please use a stronger password',
  INVALID_USERNAME_FORMAT: 'Username format is invalid',
  QUERY_TOO_LONG: 'Query is too long',
  INVALID_MODEL: 'Invalid AI model selected',
  INVALID_UUID: 'Invalid ID format',
  INVALID_ENCODED_UUID: 'Invalid encoded ID',
  INVALID_ENCODED_USER_ID: 'Invalid encoded user ID',

  // Business Logic Errors
  PLAN_LIMIT_EXCEEDED: 'You have exceeded your plan limits',
  DAILY_QUOTA_EXCEEDED: 'Daily usage limit exceeded. Please try again tomorrow',
  MONTHLY_QUOTA_EXCEEDED: 'Monthly usage limit exceeded. Please upgrade your plan',
  INSUFFICIENT_TOKENS: 'Insufficient tokens for this operation',
  UNETHICAL_QUERY: 'This query violates our content policy',
  CONTENT_GENERATION_FAILED: 'Failed to generate content. Please try again',
  COST_ESTIMATION_FAILED: 'Failed to estimate cost',
  QUERY_CATEGORIZATION_FAILED: 'Failed to categorize query',

  // AI Service Errors
  AI_SERVICE_UNAVAILABLE: 'AI service is temporarily unavailable',
  AI_PROVIDER_ERROR: 'AI provider error occurred',
  AI_MODEL_NOT_AVAILABLE: 'Selected AI model is not available',
  AI_RATE_LIMIT_EXCEEDED: 'AI service rate limit exceeded. Please try again later',
  AI_API_KEY_INVALID: 'AI service configuration error',
  AI_API_QUOTA_EXCEEDED: 'AI service quota exceeded',
  AI_API_KEY_NOT_CONFIGURED: 'AI service is not properly configured',
  EMPTY_QUERY_PROVIDED: 'Please provide a query',
  AI_REQUEST_FAILED: 'AI request failed. Please try again',
  AI_RESPONSE_PARSE_FAILED: 'Failed to process AI response',
  AI_NO_RESPONSE_GENERATED: 'No response generated from AI',
  UNETHICAL_CONTENT: 'Content violates our usage policy',

  // Query Usage Errors
  QUERY_USAGE_NOT_FOUND: 'Query usage record not found',
  QUERY_USAGE_CREATION_FAILED: 'Failed to record query usage',
  QUERY_USAGE_UPDATE_FAILED: 'Failed to update query usage',
  QUERY_USAGE_DELETION_FAILED: 'Failed to delete query usage',

  // WebSocket Errors
  WEBSOCKET_CONNECTION_FAILED: 'Failed to connect to real-time service',
  WEBSOCKET_AUTHENTICATION_FAILED: 'Real-time service authentication failed',
  WEBSOCKET_MESSAGE_FAILED: 'Failed to send real-time message',
  WEBSOCKET_BROADCAST_FAILED: 'Failed to broadcast message',
  WEBSOCKET_INVALID_TOKEN: 'Invalid real-time service token',
  WEBSOCKET_USER_NOT_FOUND: 'User not found in real-time service',

  // Email Service Errors
  EMAIL_SEND_FAILED: 'Failed to send email. Please try again',
  EMAIL_SERVICE_UNAVAILABLE: 'Email service is temporarily unavailable',
  INVALID_EMAIL_ADDRESS: 'Invalid email address',
  EMAIL_TEMPLATE_NOT_FOUND: 'Email template not found',

  // Marketing Email Collection Errors
  MARKETING_EMAIL_ALREADY_EXISTS: 'Email is already subscribed',
  MARKETING_EMAIL_CREATION_FAILED: 'Failed to subscribe email',

  // Database and Storage Errors
  DATABASE_CONNECTION_FAILED: 'Database connection failed',
  DATABASE_QUERY_FAILED: 'Database operation failed',
  REDIS_CONNECTION_FAILED: 'Cache service connection failed',
  REDIS_OPERATION_FAILED: 'Cache operation failed',
  REDIS_SET_FAILED: 'Failed to store in cache',
  REDIS_GET_FAILED: 'Failed to retrieve from cache',
  REDIS_DELETE_FAILED: 'Failed to delete from cache',
  REDIS_EXISTS_FAILED: 'Failed to check cache existence',
  REDIS_EXPIRE_FAILED: 'Failed to set cache expiration',
  REDIS_TTL_FAILED: 'Failed to get cache time-to-live',
  REDIS_KEYS_FAILED: 'Failed to get cache keys',
  REDIS_FLUSH_FAILED: 'Failed to clear cache',
  REDIS_PING_FAILED: 'Cache service health check failed',
  FILE_UPLOAD_FAILED: 'File upload failed',
  FILE_NOT_FOUND: 'File not found',
  FILE_TOO_LARGE: 'File size exceeds the limit',

  // System and Infrastructure Errors
  INTERNAL_SERVER_ERROR: 'An internal server error occurred. Please try again later',
  SERVICE_UNAVAILABLE: 'Service is temporarily unavailable',
  GATEWAY_TIMEOUT: 'Request timeout. Please try again',
  REQUEST_TIMEOUT: 'Request timeout. Please try again',
  TOO_MANY_REQUESTS: 'Too many requests. Please slow down and try again',
  MAINTENANCE_MODE: 'Service is under maintenance. Please try again later',

  // Subscription and Billing Errors
  SUBSCRIPTION_EXPIRED: 'Your subscription has expired. Please renew to continue',
  SUBSCRIPTION_NOT_FOUND: 'Subscription not found',
  PLAN_NOT_FOUND: 'Plan not found',
  PLAN_ALREADY_EXISTS: 'Plan already exists',
  PLAN_ALLOWANCE_NOT_FOUND: 'Plan allowance not found',
  CUSTOM_PLAN_PRICING_NOT_FOUND: 'Custom plan pricing not found',
  CUSTOM_PLAN_RULE_NOT_FOUND: 'Custom plan rule not found',
  USER_SUBSCRIPTION_NOT_FOUND: 'User subscription not found',
  USER_USAGE_NOT_FOUND: 'User usage record not found',
  INSUFFICIENT_ALLOWANCE: 'Insufficient allowance for this operation',
  CUSTOM_PLAN_ABUSE_DETECTED: 'Custom plan abuse detected',
  PAYMENT_FAILED: 'Payment failed. Please check your payment method',
  PAYMENT_METHOD_INVALID: 'Invalid payment method',
  BILLING_CYCLE_ERROR: 'Billing cycle error occurred',

  // Feature and Permission Errors
  FEATURE_NOT_AVAILABLE: 'This feature is not available',
  PERMISSION_DENIED: 'Permission denied',
  ROLE_INSUFFICIENT: 'Insufficient role permissions',
  ACCESS_RESTRICTED: 'Access is restricted',

  // API and Integration Errors
  API_VERSION_DEPRECATED: 'API version is deprecated',
  API_RATE_LIMIT_EXCEEDED: 'API rate limit exceeded',
  EXTERNAL_SERVICE_ERROR: 'External service error occurred',
  WEBHOOK_DELIVERY_FAILED: 'Webhook delivery failed',

  // Logging System Errors
  LOG_WRITE_FAILED: 'Logging system error',
  LOG_DIRECTORY_CREATION_FAILED: 'Logging system error',
  LOG_FILE_CREATION_FAILED: 'Logging system error',
  LOG_ROTATION_FAILED: 'Logging system error',
  LOG_FORMAT_INVALID: 'Logging system error',
  LOG_LEVEL_INVALID: 'Logging system error',

  // Generic fallback errors
  NETWORK_ERROR: 'Network error. Please check your connection',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again',
  VALIDATION_ERROR: 'Please check your input and try again',
  SERVER_ERROR: 'Server error. Please try again later',
  CLIENT_ERROR: 'Invalid request. Please check your input',
}