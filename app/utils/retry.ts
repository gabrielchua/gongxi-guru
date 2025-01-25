interface RetryOptions {
  maxAttempts?: number
  delayMs?: number
  backoff?: boolean
}

export async function retry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoff = true
  } = options

  let lastError: Error
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      console.warn(`Attempt ${attempt}/${maxAttempts} failed:`, error)
      
      if (attempt === maxAttempts) break
      
      const delay = backoff ? delayMs * Math.pow(2, attempt - 1) : delayMs
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError
} 