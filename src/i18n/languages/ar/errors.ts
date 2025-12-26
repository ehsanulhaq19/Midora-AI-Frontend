/**
 * Arabic translations - Error messages
 */

export const errors = {
  UNAUTHENTICATED: 'يرجى تسجيل الدخول للمتابعة',
  UNAUTHORIZED: 'ليس لديك إذن للوصول إلى هذا المورد',
  INVALID_TOKEN: 'انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى',
  TOKEN_EXPIRED: 'انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى',
  INVALID_CREDENTIALS: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  ACCOUNT_DISABLED: 'تم تعطيل حسابك. يرجى الاتصال بالدعم',
  ACCOUNT_LOCKED: 'تم قفل حسابك مؤقتًا. يرجى المحاولة لاحقًا',
  INSUFFICIENT_PERMISSIONS: 'ليس لديك أذونات كافية لهذا الإجراء',
  NOT_VERIFIED_USER: 'يرجى التحقق من عنوان بريدك الإلكتروني للمتابعة',
  EMAIL_ALREADY_REGISTERED: 'حساب بهذا البريد الإلكتروني موجود بالفعل',
  USER_NOT_FOUND: 'لم يتم العثور على حساب المستخدم',
  INVALID_OTP: 'رمز التحقق غير صالح. يرجى المحاولة مرة أخرى',
  OTP_EXPIRED: 'انتهت صلاحية رمز التحقق. يرجى طلب رمز جديد',
  EMAIL_VERIFICATION_REQUIRED: 'يرجى التحقق من عنوان بريدك الإلكتروني',
  EMAIL_NOT_FOUND: 'لم يتم العثور على حساب بهذا العنوان الإلكتروني',
  PASSWORD_RESET_FAILED: 'فشل إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى',
  CONVERSATION_NOT_FOUND: 'لم يتم العثور على المحادثة',
  MESSAGE_NOT_FOUND: 'لم يتم العثور على الرسالة',
  INVALID_INPUT: 'تم توفير إدخال غير صالح',
  MISSING_REQUIRED_FIELD: 'الحقل المطلوب مفقود',
  INVALID_EMAIL_FORMAT: 'يرجى إدخال عنوان بريد إلكتروني صالح',
  INVALID_PASSWORD_FORMAT: 'تنسيق كلمة المرور غير صالح',
  PASSWORD_TOO_WEAK: 'كلمة المرور ضعيفة جدًا. يرجى استخدام كلمة مرور أقوى',
  PLAN_LIMIT_EXCEEDED: 'لقد تجاوزت حدود خطتك',
  DAILY_QUOTA_EXCEEDED: 'تم تجاوز حد الاستخدام اليومي. يرجى المحاولة غدًا',
  MONTHLY_QUOTA_EXCEEDED: 'تم تجاوز حد الاستخدام الشهري. يرجى ترقية خطتك',
  INSUFFICIENT_TOKENS: 'رموز غير كافية لهذه العملية',
  AI_SERVICE_UNAVAILABLE: 'خدمة الذكاء الاصطناعي غير متاحة مؤقتًا',
  AI_PROVIDER_ERROR: 'حدث خطأ في مزود الذكاء الاصطناعي',
  AI_MODEL_NOT_AVAILABLE: 'نموذج الذكاء الاصطناعي المحدد غير متاح',
  EMAIL_SEND_FAILED: 'فشل إرسال البريد الإلكتروني. يرجى المحاولة مرة أخرى',
  INTERNAL_SERVER_ERROR: 'حدث خطأ في الخادم الداخلي. يرجى المحاولة لاحقًا',
  SERVICE_UNAVAILABLE: 'الخدمة غير متاحة مؤقتًا',
  GATEWAY_TIMEOUT: 'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى',
  REQUEST_TIMEOUT: 'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى',
  TOO_MANY_REQUESTS: 'طلبات كثيرة جدًا. يرجى التباطؤ والمحاولة مرة أخرى',
  SUBSCRIPTION_EXPIRED: 'انتهت صلاحية اشتراكك. يرجى التجديد للمتابعة',
  SUBSCRIPTION_NOT_FOUND: 'لم يتم العثور على الاشتراك',
  PLAN_NOT_FOUND: 'لم يتم العثور على الخطة',
  PAYMENT_FAILED: 'فشل الدفع. يرجى التحقق من طريقة الدفع',
  FEATURE_NOT_AVAILABLE: 'هذه الميزة غير متاحة',
  PERMISSION_DENIED: 'تم رفض الإذن',
  NETWORK_ERROR: 'خطأ في الشبكة. يرجى التحقق من اتصالك',
  UNKNOWN_ERROR: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى',
  VALIDATION_ERROR: 'يرجى التحقق من إدخالك والمحاولة مرة أخرى',
  SERVER_ERROR: 'خطأ في الخادم. يرجى المحاولة لاحقًا',
  CLIENT_ERROR: 'طلب غير صالح. يرجى التحقق من إدخالك',
  generic: {
    title: 'حدث خطأ ما',
    message: 'واجهنا خطأ غير متوقع. يرجى المحاولة لاحقًا.',
    retry: 'إعادة المحاولة',
    goHome: 'الذهاب إلى الرئيسية'
  },
  notFound: {
    title: 'الصفحة غير موجودة',
    message: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
    goHome: 'الذهاب إلى الرئيسية'
  },
  unauthorized: {
    title: 'تم رفض الوصول',
    message: 'ليس لديك إذن للوصول إلى هذه الصفحة.',
    login: 'تسجيل الدخول',
    goHome: 'الذهاب إلى الرئيسية'
  }
}

