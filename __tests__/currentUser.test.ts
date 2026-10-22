import { CurrentUserQueryOptions } from '@/services/currentUser'

describe('CurrentUserQueryOptions.currentUser', () => {
  // Buttons wait for this query, so a logged-out visitor must not wait for retries
  it('should not retry, so a logged-out visitor is known at once', () => {
    expect(CurrentUserQueryOptions.currentUser().retry).toBe(false)
  })
})
