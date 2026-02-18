/**
 * Chinese translations - Error messages
 */

export const errors = {
  UNAUTHENTICATED: '请登录以继续',
  UNAUTHORIZED: '您没有权限访问此资源',
  INVALID_TOKEN: '您的会话已过期。请重新登录',
  TOKEN_EXPIRED: '您的会话已过期。请重新登录',
  INVALID_CREDENTIALS: '邮箱或密码无效',
  ACCOUNT_DISABLED: '您的账户已被禁用。请联系支持',
  ACCOUNT_LOCKED: '您的账户已被暂时锁定。请稍后再试',
  INSUFFICIENT_PERMISSIONS: '您没有足够的权限执行此操作',
  NOT_VERIFIED_USER: '请验证您的邮箱地址以继续',
  EMAIL_ALREADY_REGISTERED: '此邮箱已注册账户',
  USER_NOT_FOUND: '未找到用户账户',
  INVALID_OTP: '验证代码无效。请重试',
  OTP_EXPIRED: '验证代码已过期。请请求新的代码',
  EMAIL_VERIFICATION_REQUIRED: '请验证您的邮箱地址',
  EMAIL_NOT_FOUND: '未找到此邮箱地址的账户',
  PASSWORD_RESET_FAILED: '密码重置失败。请重试',
  CONVERSATION_NOT_FOUND: '未找到对话',
  MESSAGE_NOT_FOUND: '未找到消息',
  INVALID_INPUT: '提供的输入无效',
  MISSING_REQUIRED_FIELD: '缺少必填字段',
  INVALID_EMAIL_FORMAT: '请输入有效的邮箱地址',
  INVALID_PASSWORD_FORMAT: '密码格式无效',
  PASSWORD_TOO_WEAK: '密码太弱。请使用更强的密码',
  PLAN_LIMIT_EXCEEDED: '您已超过计划限制',
  DAILY_QUOTA_EXCEEDED: '每日使用限制已超过。请明天再试',
  MONTHLY_QUOTA_EXCEEDED: '每月使用限制已超过。请升级您的计划',
  INSUFFICIENT_TOKENS: '此操作的令牌不足',
  AI_SERVICE_UNAVAILABLE: 'AI 服务暂时不可用',
  AI_PROVIDER_ERROR: 'AI 提供商发生错误',
  AI_MODEL_NOT_AVAILABLE: '所选 AI 模型不可用',
  EMAIL_SEND_FAILED: '发送邮件失败。请重试',
  INTERNAL_SERVER_ERROR: '发生内部服务器错误。请稍后再试',
  SERVICE_UNAVAILABLE: '服务暂时不可用',
  GATEWAY_TIMEOUT: '请求超时。请重试',
  REQUEST_TIMEOUT: '请求超时。请重试',
  TOO_MANY_REQUESTS: '请求过多。请放慢速度并重试',
  SUBSCRIPTION_EXPIRED: '您的订阅已过期。请续订以继续',
  SUBSCRIPTION_NOT_FOUND: '未找到订阅',
  PLAN_NOT_FOUND: '未找到计划',
  PAYMENT_FAILED: '支付失败。请检查您的支付方式',
  FEATURE_NOT_AVAILABLE: '此功能不可用',
  PERMISSION_DENIED: '权限被拒绝',
  NETWORK_ERROR: '网络错误。请检查您的连接',
  UNKNOWN_ERROR: '发生意外错误。请重试',
  VALIDATION_ERROR: '请检查您的输入并重试',
  SERVER_ERROR: '服务器错误。请稍后再试',
  CLIENT_ERROR: '无效请求。请检查您的输入',
  generic: {
    title: '出了点问题',
    message: '我们遇到了意外错误。请稍后再试。',
    retry: '重试',
    goHome: '返回首页'
  },
  notFound: {
    title: '页面未找到',
    message: '您要查找的页面不存在或已被移动。',
    goHome: '返回首页'
  },
  unauthorized: {
    title: '访问被拒绝',
    message: '您没有权限访问此页面。',
    login: '登录',
    goHome: '返回首页'
  }
}

