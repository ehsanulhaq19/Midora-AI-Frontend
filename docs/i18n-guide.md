# Internationalization (i18n) Guide

## Overview

The Midora AI frontend uses a modular internationalization system that allows for easy translation management and language switching. The system is designed to be scalable and maintainable.

## Structure

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

## Adding a New Language

### Step 1: Create Language Folder

Create a new folder for your language (e.g., `es` for Spanish):

```bash
mkdir -p src/i18n/languages/es
```

### Step 2: Create Translation Files

Create the same structure as English for your language:

#### `src/i18n/languages/es/common.ts`
```typescript
export const common = {
  loading: 'Cargando...',
  error: 'Error',
  success: 'Éxito',
  cancel: 'Cancelar',
  confirm: 'Confirmar',
  save: 'Guardar',
  delete: 'Eliminar',
  edit: 'Editar',
  close: 'Cerrar',
  back: 'Atrás',
  next: 'Siguiente',
  previous: 'Anterior',
  submit: 'Enviar',
  reset: 'Restablecer',
  search: 'Buscar',
  filter: 'Filtrar',
  sort: 'Ordenar',
  refresh: 'Actualizar',
  retry: 'Reintentar',
}
```

#### `src/i18n/languages/es/auth.ts`
```typescript
export const auth = {
  login: 'Iniciar Sesión',
  logout: 'Cerrar Sesión',
  signup: 'Registrarse',
  email: 'Correo Electrónico',
  password: 'Contraseña',
  confirmPassword: 'Confirmar Contraseña',
  firstName: 'Nombre',
  lastName: 'Apellido',
  forgotPassword: '¿Olvidaste tu contraseña?',
  resetPassword: 'Restablecer Contraseña',
  rememberMe: 'Recordarme',
  signInWithGoogle: 'Continuar con Google',
  signUpWithGoogle: 'Continuar con Google',
  alreadyHaveAccount: '¿Ya tienes una cuenta?',
  dontHaveAccount: '¿No tienes una cuenta?',
  createAccount: 'Crear Cuenta',
  welcomeBack: 'Bienvenido de Vuelta',
  joinMidoraAI: 'Únete a Midora AI y comienza tu viaje',
  signInToAccount: 'Inicia sesión en tu cuenta de Midora AI',
  startJourney: 'Únete a Midora AI y comienza tu viaje',
  enterEmail: 'Ingresa tu correo electrónico',
  enterPassword: 'Ingresa tu contraseña',
  createPassword: 'Crear una contraseña',
  confirmYourPassword: 'Confirma tu contraseña',
  enterFullName: 'Ingresa tu nombre completo',
  enterFirstName: 'Nombre',
  enterLastName: 'Apellido',
  signingIn: 'Iniciando sesión...',
  creatingAccount: 'Creando cuenta...',
  loginSuccess: 'Inicio de sesión exitoso',
  signupSuccess: 'Cuenta creada exitosamente',
  loginError: 'Error al iniciar sesión',
  signupError: 'Error al crear cuenta',
  invalidCredentials: 'Correo electrónico o contraseña inválidos',
  emailRequired: 'El correo electrónico es requerido',
  passwordRequired: 'La contraseña es requerida',
  nameRequired: 'El nombre es requerido',
  validEmailRequired: 'Por favor ingresa un correo electrónico válido',
  passwordMinLength: 'La contraseña debe tener al menos 6 caracteres',
  passwordsDoNotMatch: 'Las contraseñas no coinciden',
  confirmPasswordRequired: 'Por favor confirma tu contraseña',
}
```

#### `src/i18n/languages/es/navigation.ts`
```typescript
export const navigation = {
  home: 'Inicio',
  chat: 'Chat',
  dashboard: 'Panel',
  profile: 'Perfil',
  settings: 'Configuración',
  about: 'Acerca de',
  contact: 'Contacto',
  help: 'Ayuda',
  support: 'Soporte',
}
```

#### `src/i18n/languages/es/chat.ts`
```typescript
export const chat = {
  title: 'Midora AI',
  subtitle: 'Tu compañero inteligente para el futuro',
  welcome: 'Bienvenido a Midora AI',
  welcomeComplete: '¡Bienvenida Completa!',
  readyToServe: 'Listo para Servir',
  comingSoon: 'Próximamente',
  aiPoweredExperience: 'Experiencia Impulsada por IA',
  advancedFeatures: 'Características Avanzadas',
  welcomeToMidoraAI: 'Bienvenido a Midora AI',
  intelligentCompanion: 'Tu compañero inteligente para el futuro',
  allSet: '¡Todo listo!',
  featuresLaunchingSoon: 'Nuestras características de IA se lanzarán pronto.',
  stepOfWelcome: 'Paso {step} de la secuencia de bienvenida',
}
```

#### `src/i18n/languages/es/errors.ts`
```typescript
export const errors = {
  unauthorized: 'No Autorizado',
  accessDenied: 'Acceso Denegado',
  pageNotFound: 'Página No Encontrada',
  serverError: 'Error del Servidor',
  networkError: 'Error de Red',
  timeoutError: 'Tiempo de Espera Agotado',
  validationError: 'Error de Validación',
  authenticationRequired: 'Autenticación requerida',
  sessionExpired: 'Sesión expirada',
  invalidToken: 'Token inválido',
  userNotFound: 'Usuario no encontrado',
  emailAlreadyExists: 'El correo electrónico ya existe',
  weakPassword: 'La contraseña es muy débil',
  invalidEmail: 'Dirección de correo electrónico inválida',
  genericError: 'Ocurrió un error',
}
```

#### `src/i18n/languages/es/success.ts`
```typescript
export const success = {
  loginSuccess: 'Inicio de sesión exitoso',
  signupSuccess: 'Cuenta creada exitosamente',
  logoutSuccess: 'Sesión cerrada exitosamente',
  passwordResetSent: 'Correo de restablecimiento de contraseña enviado',
  passwordResetSuccess: 'Contraseña restablecida exitosamente',
  emailVerified: 'Correo electrónico verificado exitosamente',
  profileUpdated: 'Perfil actualizado exitosamente',
  settingsSaved: 'Configuración guardada exitosamente',
}
```

### Step 3: Create Main Index File

#### `src/i18n/languages/es/index.ts`
```typescript
import { common } from './common'
import { auth } from './auth'
import { navigation } from './navigation'
import { chat } from './chat'
import { errors } from './errors'
import { success } from './success'

export const esTranslations = {
  common,
  auth,
  navigation,
  chat,
  errors,
  success,
}
```

### Step 4: Update Main i18n Configuration

#### `src/i18n/index.ts`
```typescript
import { appConfig } from '@/config/app'

export type SupportedLanguage = 'en' | 'es' // Add your new language

// Import language modules
import { enTranslations } from './languages/en'
import { esTranslations } from './languages/es' // Import your new language

// Translation storage
const translations: Record<SupportedLanguage, any> = {
  en: enTranslations,
  es: esTranslations, // Add your new language
}

// ... rest of the configuration
```

### Step 5: Update App Configuration

#### `src/config/app.ts`
```typescript
// UI settings
ui: {
  defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
  supportedLanguages: (process.env.NEXT_PUBLIC_SUPPORTED_LANGUAGES || 'en,es').split(','), // Add your language
  theme: (process.env.NEXT_PUBLIC_DEFAULT_THEME as AppConfig['ui']['theme']) || 'system',
},
```

### Step 6: Update Environment Variables

#### `.env.local`
```env
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
NEXT_PUBLIC_SUPPORTED_LANGUAGES=en,es
```

## Adding New Translation Keys

### Step 1: Add to English Translation File

```typescript
// src/i18n/languages/en/yourModule.ts
export const yourModule = {
  newKey: 'New Translation',
  anotherKey: 'Another Translation',
}
```

### Step 2: Add to English Index

```typescript
// src/i18n/languages/en/index.ts
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

### Step 3: Add to Other Languages

Repeat the same process for all supported languages.

### Step 4: Use in Components

```typescript
import { t } from '@/i18n'

const title = t('yourModule.newKey')
```

## Best Practices

### 1. Naming Conventions
- Use descriptive, hierarchical keys
- Use camelCase for keys
- Group related translations in modules

### 2. Translation Keys
```typescript
// Good
auth.loginButton
auth.forgotPasswordLink
chat.welcomeMessage

// Avoid
btn1
link2
msg3
```

### 3. Parameter Substitution
```typescript
// In translation file
stepOfWelcome: 'Step {step} of the welcome sequence'

// In component
const message = tWithParams('chat.stepOfWelcome', { step: 1 })
```

### 4. Consistency
- Keep the same structure across all languages
- Use consistent terminology
- Maintain the same key names across languages

### 5. Testing
- Test all translation keys
- Verify parameter substitution works
- Check for missing translations

## Language Detection

The system can be extended to detect user's preferred language:

```typescript
// In src/i18n/index.ts
export function initializeI18n(): void {
  // Detect browser language
  const browserLang = navigator.language.split('-')[0]
  const supportedLang = getAvailableLanguages().includes(browserLang as SupportedLanguage)
  
  if (supportedLang) {
    currentLanguage = browserLang as SupportedLanguage
  } else {
    currentLanguage = appConfig.ui.defaultLanguage as SupportedLanguage
  }
}
```

## Language Switching

Add a language switcher component:

```typescript
import { setCurrentLanguage, getCurrentLanguage, getAvailableLanguages } from '@/i18n'

function LanguageSwitcher() {
  const currentLang = getCurrentLanguage()
  const availableLangs = getAvailableLanguages()
  
  const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang)
    // Optionally reload the page or trigger a re-render
    window.location.reload()
  }
  
  return (
    <select value={currentLang} onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}>
      {availableLangs.map(lang => (
        <option key={lang} value={lang}>
          {lang.toUpperCase()}
        </option>
      ))}
    </select>
  )
}
```

## Troubleshooting

### Common Issues

1. **Translation not found:**
   - Check if the key exists in all language files
   - Verify the key path is correct
   - Ensure the module is imported in the index file

2. **Parameter substitution not working:**
   - Check parameter names match exactly
   - Verify `tWithParams` is used instead of `t`
   - Ensure parameters are passed correctly

3. **Language not switching:**
   - Verify the language is added to `SupportedLanguage` type
   - Check if the language is imported in the main index
   - Ensure the language is in the supported languages list

### Debug Mode

Enable debug logging:

```typescript
// In src/i18n/index.ts
export function t(key: string): string {
  const keys = key.split('.')
  let value: any = translations[currentLanguage]
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      console.warn(`Translation key not found: ${key} in language: ${currentLanguage}`)
      return key
    }
  }
  
  return typeof value === 'string' ? value : key
}
```

## Future Enhancements

- [ ] Add pluralization support
- [ ] Implement date/time formatting
- [ ] Add number formatting
- [ ] Create translation management UI
- [ ] Add translation validation
- [ ] Implement lazy loading for translations
- [ ] Add translation fallbacks
