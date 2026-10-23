import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, render, fireEvent, waitFor } from '../utils/tests'
import '@testing-library/jest-dom/extend-expect' // Import the matchers
import Login from 'src/app/account/login/page'
import { CurrentUserInfo } from '@/services/currentUser'

// A stable router, like Next's: next-router-mock returns a new one on every navigation
const mockRouter = { push: jest.fn(), replace: jest.fn() }
jest.mock('next/navigation', () => ({ useRouter: () => mockRouter }))

const mockFetchUserInfo = jest.fn<Promise<CurrentUserInfo | null>, []>()
jest.mock('@/services/currentUser', () => ({
  CurrentUserQueryOptions: {
    currentUser: () => ({
      queryKey: ['currentUser'],
      queryFn: () => mockFetchUserInfo(),
      retry: false,
    }),
  },
}))

const loggedOut = () => Promise.reject(new Error('Request failed with status code 401'))
const user1 = { id: 1, user: 'Juan Rizzo', email: 'user1@example.com' } as CurrentUserInfo

const renderLogin = (queryClient = new QueryClient()) =>
  render(
    <QueryClientProvider client={queryClient}>
      <Login />
    </QueryClientProvider>
  )

// Query results reach components in a later task; this lets them render and run their effects
const flushRenders = () => act(() => new Promise((resolve) => setTimeout(resolve, 0)))

const waitForStatus = async (queryClient: QueryClient, status: 'error' | 'success') => {
  await waitFor(() => expect(queryClient.getQueryState(['currentUser'])?.status).toBe(status))
  await flushRenders()
}

describe('Login page', () => {
  beforeEach(() => {
    mockRouter.push.mockReset()
    mockRouter.replace.mockReset()
    mockFetchUserInfo.mockReset()
  })

  it('moves to register form if login button is clicked', () => {
    mockFetchUserInfo.mockImplementation(loggedOut)
    const { getByText } = renderLogin()
    const registerLink = getByText('Registrarse')

    fireEvent.click(registerLink)
    const registerExtraField = getByText('Nombre')
    expect(registerExtraField).toBeInTheDocument()
  })

  describe('when the user is already logged in', () => {
    it('should redirect to their profile', async () => {
      mockFetchUserInfo.mockResolvedValue(user1)
      renderLogin()

      await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith('/account/profile'))
    })
  })

  describe('when the user is logged out', () => {
    it('should stay on the login page', async () => {
      mockFetchUserInfo.mockImplementation(loggedOut)
      const queryClient = new QueryClient()
      renderLogin(queryClient)

      await waitForStatus(queryClient, 'error')
      expect(mockRouter.replace).not.toHaveBeenCalled()
    })

    it('should stay on the login page even if a user is still cached (e.g. an expired session)', async () => {
      mockFetchUserInfo.mockImplementation(loggedOut)
      const queryClient = new QueryClient()
      queryClient.setQueryData(['currentUser'], user1)
      renderLogin(queryClient)

      await waitForStatus(queryClient, 'error')
      expect(mockRouter.replace).not.toHaveBeenCalled()
    })

    it('should not redirect to the profile once they log in on this page', async () => {
      mockFetchUserInfo.mockImplementation(loggedOut)
      const queryClient = new QueryClient()
      renderLogin(queryClient)
      await waitForStatus(queryClient, 'error')

      // What a successful login does: the current user is refetched
      mockFetchUserInfo.mockResolvedValue(user1)
      await act(() => queryClient.refetchQueries({ queryKey: ['currentUser'] }))
      await flushRenders()

      expect(queryClient.getQueryData(['currentUser'])).toEqual(user1)
      expect(mockRouter.replace).not.toHaveBeenCalled()
    })
  })
})
