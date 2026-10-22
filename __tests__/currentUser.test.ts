import { CurrentUserQueryOptions } from '@/services/currentUser'

type Retry = (failureCount: number, error: Error) => boolean

const httpError = (status: number) =>
  Object.assign(new Error(`Request failed with status code ${status}`), {
    isAxiosError: true,
    response: { status },
  })

describe('CurrentUserQueryOptions.currentUser', () => {
  const retry = CurrentUserQueryOptions.currentUser().retry as Retry

  // Buttons wait for this query, so a logged-out visitor must not wait for retries
  it('should not retry a 401, so a logged-out visitor is known at once', () => {
    expect(retry(0, httpError(401))).toBe(false)
  })

  it.each([
    ['a server error', httpError(502)],
    ['a network error', new Error('Network Error')],
  ])('should retry %s up to 3 times', (_, error) => {
    expect(retry(0, error)).toBe(true)
    expect(retry(2, error)).toBe(true)
    expect(retry(3, error)).toBe(false)
  })
})
