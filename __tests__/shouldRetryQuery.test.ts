import { shouldRetryQuery } from '../utils/query/shouldRetryQuery'

const httpError = (status: number) =>
  Object.assign(new Error(`Request failed with status code ${status}`), {
    isAxiosError: true,
    response: { status },
  })

describe('shouldRetryQuery', () => {
  it.each([400, 401, 403, 404, 422])('should not retry a %s', (status) => {
    expect(shouldRetryQuery(0, httpError(status))).toBe(false)
  })

  it.each([
    ['a 500', httpError(500)],
    ['a 503', httpError(503)],
    ['a network error', Object.assign(new Error('Network Error'), { isAxiosError: true })],
  ])('should retry %s up to 3 times', (_, error) => {
    expect(shouldRetryQuery(0, error)).toBe(true)
    expect(shouldRetryQuery(2, error)).toBe(true)
    expect(shouldRetryQuery(3, error)).toBe(false)
  })
})
