import { AxiosError } from 'axios'

// The API explains in Spanish why a request failed (e.g. the user was already
// invited). Axios' own message is in English, so it is never shown.
const message = (error: Error, fallback: string): string => {
  const apiMessage = ((error as AxiosError).response?.data as { message?: unknown } | undefined)
    ?.message
  return typeof apiMessage === 'string' ? apiMessage : fallback
}

const ApiErrors = { message }
export default ApiErrors
