import { QueryClient } from '@tanstack/react-query'
import { shouldRetryQuery } from './shouldRetryQuery'

// The app-wide client, shared so tests can check the real defaults.
export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: shouldRetryQuery } },
})
