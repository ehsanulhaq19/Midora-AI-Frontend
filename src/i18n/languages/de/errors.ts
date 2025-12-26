/**
 * German translations - Error messages
 */

export const errors = {
  UNAUTHENTICATED: 'Bitte melden Sie sich an, um fortzufahren',
  UNAUTHORIZED: 'Sie haben keine Berechtigung, auf diese Ressource zuzugreifen',
  INVALID_TOKEN: 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an',
  TOKEN_EXPIRED: 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an',
  INVALID_CREDENTIALS: 'Ungültige E-Mail oder Passwort',
  ACCOUNT_DISABLED: 'Ihr Konto wurde deaktiviert. Bitte kontaktieren Sie den Support',
  ACCOUNT_LOCKED: 'Ihr Konto wurde vorübergehend gesperrt. Bitte versuchen Sie es später erneut',
  INSUFFICIENT_PERMISSIONS: 'Sie haben keine ausreichenden Berechtigungen für diese Aktion',
  NOT_VERIFIED_USER: 'Bitte verifizieren Sie Ihre E-Mail-Adresse, um fortzufahren',
  EMAIL_ALREADY_REGISTERED: 'Ein Konto mit dieser E-Mail existiert bereits',
  USER_NOT_FOUND: 'Benutzerkonto nicht gefunden',
  INVALID_OTP: 'Ungültiger Verifizierungscode. Bitte versuchen Sie es erneut',
  OTP_EXPIRED: 'Verifizierungscode ist abgelaufen. Bitte fordern Sie einen neuen an',
  EMAIL_VERIFICATION_REQUIRED: 'Bitte verifizieren Sie Ihre E-Mail-Adresse',
  EMAIL_NOT_FOUND: 'Kein Konto mit dieser E-Mail-Adresse gefunden',
  PASSWORD_RESET_FAILED: 'Passwort-Reset fehlgeschlagen. Bitte versuchen Sie es erneut',
  CONVERSATION_NOT_FOUND: 'Konversation nicht gefunden',
  MESSAGE_NOT_FOUND: 'Nachricht nicht gefunden',
  INVALID_INPUT: 'Ungültige Eingabe bereitgestellt',
  MISSING_REQUIRED_FIELD: 'Pflichtfeld fehlt',
  INVALID_EMAIL_FORMAT: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
  INVALID_PASSWORD_FORMAT: 'Passwortformat ist ungültig',
  PASSWORD_TOO_WEAK: 'Passwort ist zu schwach. Bitte verwenden Sie ein stärkeres Passwort',
  PLAN_LIMIT_EXCEEDED: 'Sie haben Ihre Planlimits überschritten',
  DAILY_QUOTA_EXCEEDED: 'Tägliches Nutzungslimit überschritten. Bitte versuchen Sie es morgen erneut',
  MONTHLY_QUOTA_EXCEEDED: 'Monatliches Nutzungslimit überschritten. Bitte upgraden Sie Ihren Plan',
  INSUFFICIENT_TOKENS: 'Unzureichende Tokens für diese Operation',
  AI_SERVICE_UNAVAILABLE: 'AI-Service ist vorübergehend nicht verfügbar',
  AI_PROVIDER_ERROR: 'AI-Provider-Fehler aufgetreten',
  AI_MODEL_NOT_AVAILABLE: 'Ausgewähltes AI-Modell ist nicht verfügbar',
  EMAIL_SEND_FAILED: 'E-Mail senden fehlgeschlagen. Bitte versuchen Sie es erneut',
  INTERNAL_SERVER_ERROR: 'Ein interner Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut',
  SERVICE_UNAVAILABLE: 'Service ist vorübergehend nicht verfügbar',
  GATEWAY_TIMEOUT: 'Anfrage-Timeout. Bitte versuchen Sie es erneut',
  REQUEST_TIMEOUT: 'Anfrage-Timeout. Bitte versuchen Sie es erneut',
  TOO_MANY_REQUESTS: 'Zu viele Anfragen. Bitte verlangsamen Sie und versuchen Sie es erneut',
  SUBSCRIPTION_EXPIRED: 'Ihr Abonnement ist abgelaufen. Bitte erneuern Sie, um fortzufahren',
  SUBSCRIPTION_NOT_FOUND: 'Abonnement nicht gefunden',
  PLAN_NOT_FOUND: 'Plan nicht gefunden',
  PAYMENT_FAILED: 'Zahlung fehlgeschlagen. Bitte überprüfen Sie Ihre Zahlungsmethode',
  FEATURE_NOT_AVAILABLE: 'Diese Funktion ist nicht verfügbar',
  PERMISSION_DENIED: 'Zugriff verweigert',
  NETWORK_ERROR: 'Netzwerkfehler. Bitte überprüfen Sie Ihre Verbindung',
  UNKNOWN_ERROR: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut',
  VALIDATION_ERROR: 'Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut',
  SERVER_ERROR: 'Serverfehler. Bitte versuchen Sie es später erneut',
  CLIENT_ERROR: 'Ungültige Anfrage. Bitte überprüfen Sie Ihre Eingabe',
  generic: {
    title: 'Etwas ist schief gelaufen',
    message: 'Wir sind auf einen unerwarteten Fehler gestoßen. Bitte versuchen Sie es später erneut.',
    retry: 'Erneut versuchen',
    goHome: 'Zur Startseite'
  },
  notFound: {
    title: 'Seite nicht gefunden',
    message: 'Die Seite, die Sie suchen, existiert nicht oder wurde verschoben.',
    goHome: 'Zur Startseite'
  },
  unauthorized: {
    title: 'Zugriff verweigert',
    message: 'Sie haben keine Berechtigung, auf diese Seite zuzugreifen.',
    login: 'Anmelden',
    goHome: 'Zur Startseite'
  }
}

