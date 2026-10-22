import axios from 'axios'

// The API explains in Spanish why a request failed (e.g. the user was already
// invited). Axios' own message is in English, so it is never shown.
const message = (error: Error, fallback: string): string => {
  if (!axios.isAxiosError<{ message?: unknown }>(error)) return fallback

  const apiMessage = error.response?.data?.message
  if (typeof apiMessage === 'string') return apiMessage
  // Validation errors list every failed rule
  if (Array.isArray(apiMessage) && apiMessage.every((item) => typeof item === 'string'))
    return apiMessage.join('. ')
  return fallback
}

const ApiErrors = { message }
export default ApiErrors
