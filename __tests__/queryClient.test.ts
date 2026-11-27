import { QueryObserver } from '@tanstack/react-query'
import { queryClient } from '../utils/query/queryClient'

describe('app queryClient', () => {
  afterEach(() => queryClient.clear())

  const run = async (status: number) => {
    const queryFn = jest.fn().mockRejectedValue(
      Object.assign(new Error(`Request failed with status code ${status}`), {
        isAxiosError: true,
        response: { status },
      })
    )
    const observer = new QueryObserver(queryClient, { queryKey: ['project', status], queryFn })
    const unsubscribe = observer.subscribe(() => undefined)
    // A retry waits 1 s before trying again, so after 50 ms only a non-retried error is visible.
    await new Promise((resolve) => setTimeout(resolve, 50))
    const result = {
      isError: observer.getCurrentResult().isError,
      calls: queryFn.mock.calls.length,
    }
    unsubscribe()
    return result
  }

  it('should show a 404 at once, without retrying it', async () => {
    expect(await run(404)).toEqual({ isError: true, calls: 1 })
  })

  it('should keep retrying a 500', async () => {
    expect(await run(500)).toEqual({ isError: false, calls: 1 })
  })
})
