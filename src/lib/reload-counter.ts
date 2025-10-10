/**
 * Reload Counter Utility
 * Manages 401 error reload attempts to prevent infinite reload loops
 */

const RELOAD_COUNTER_KEY = 'auth_reload_count'
const MAX_RELOAD_ATTEMPTS = 3
const RELOAD_COUNTER_EXPIRY_KEY = 'auth_reload_count_expiry'
const COUNTER_EXPIRY_TIME = 5 * 60 * 1000 // 5 minutes

/**
 * Get the current reload attempt count
 */
export function getReloadCount(): number {
  if (typeof window === 'undefined') return 0
  
  try {
    const count = localStorage.getItem(RELOAD_COUNTER_KEY)
    const expiry = localStorage.getItem(RELOAD_COUNTER_EXPIRY_KEY)
    
    // Check if counter has expired
    if (expiry && Date.now() > parseInt(expiry, 10)) {
      resetReloadCount()
      return 0
    }
    
    return count ? parseInt(count, 10) : 0
  } catch (error) {
    console.error('Error getting reload count:', error)
    return 0
  }
}

/**
 * Increment the reload attempt count
 */
export function incrementReloadCount(): number {
  if (typeof window === 'undefined') return 0
  
  try {
    const currentCount = getReloadCount()
    const newCount = currentCount + 1
    
    localStorage.setItem(RELOAD_COUNTER_KEY, newCount.toString())
    
    // Set expiry time if not already set
    if (!localStorage.getItem(RELOAD_COUNTER_EXPIRY_KEY)) {
      const expiryTime = Date.now() + COUNTER_EXPIRY_TIME
      localStorage.setItem(RELOAD_COUNTER_EXPIRY_KEY, expiryTime.toString())
    }
    
    console.log(`401 reload attempt count: ${newCount}/${MAX_RELOAD_ATTEMPTS}`)
    return newCount
  } catch (error) {
    console.error('Error incrementing reload count:', error)
    return 0
  }
}

/**
 * Reset the reload attempt count
 */
export function resetReloadCount(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(RELOAD_COUNTER_KEY)
    localStorage.removeItem(RELOAD_COUNTER_EXPIRY_KEY)
    console.log('Reload counter reset')
  } catch (error) {
    console.error('Error resetting reload count:', error)
  }
}

/**
 * Check if reload is allowed based on attempt count
 */
export function canReload(): boolean {
  const count = getReloadCount()
  return count < MAX_RELOAD_ATTEMPTS
}

/**
 * Get the maximum reload attempts allowed
 */
export function getMaxReloadAttempts(): number {
  return MAX_RELOAD_ATTEMPTS
}

/**
 * Handle 401 error with reload logic
 * Returns true if reload was initiated, false otherwise
 */
export function handle401WithReload(): boolean {
  if (typeof window === 'undefined') return false
  
  if (canReload()) {
    const newCount = incrementReloadCount()
    console.warn(`401 Unauthorized detected. Reloading page (attempt ${newCount}/${MAX_RELOAD_ATTEMPTS})`)
    
    // Use setTimeout to allow any cleanup code to run
    setTimeout(() => {
      window.location.reload()
    }, 100)
    
    return true
  } else {
    console.error(`Maximum reload attempts (${MAX_RELOAD_ATTEMPTS}) reached for 401 errors. Redirecting to login.`)
    // Reset counter after max attempts and redirect to login
    resetReloadCount()
    
    // Redirect to login page
    setTimeout(() => {
      window.location.href = '/signup'
    }, 100)
    
    return false
  }
}

