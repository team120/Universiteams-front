import axios from 'axios'

// A 4xx response (not found, forbidden, ...) can't succeed on a retry, so retrying only
// delays showing the error. Network errors and 5xx are retried up to 3 times.
export const shouldRetryQuery = (failureCount: number, error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status !== undefined && status >= 400 && status < 500) return false
  }
  return failureCount < 3
}
