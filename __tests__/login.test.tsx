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

const httpError = (status: number) =>
  Object.assign(new Error(`Request failed with status code ${status}`), {
    isAxiosError: true,
    response: { status },
  })
const loggedOut = () => Promise.reject(httpError(401))
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

  it('moves to register form if login button is clicked', async () => {
    mockFetchUserInfo.mockImplementation(loggedOut)
    const { findByText, getByText } = renderLogin()
    const registerLink = await findByText('Registrarse')

    fireEvent.click(registerLink)
    const registerExtraField = getByText('Nombre')
    expect(registerExtraField).toBeInTheDocument()
  })

  describe('when the user is already logged in', () => {
    it('should redirect to their profile', async () => {
      mockFetchUserInfo.mockResolvedValue(user1)
      const { queryByRole } = renderLogin()

      await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith('/account/profile'))
      // The login form never shows before the redirect
      expect(queryByRole('textbox', { name: 'Correo electrónico' })).toBeNull()
    })
  })

  describe('when the user check fails with a server error', () => {
    it('should show the form, and still redirect once the user loads', async () => {
      mockFetchUserInfo.mockRejectedValue(httpError(502))
      const queryClient = new QueryClient()
      const { findByRole } = renderLogin(queryClient)
      await waitForStatus(queryClient, 'error')
      expect(await findByRole('textbox', { name: 'Correo electrónico' })).toBeInTheDocument()
      expect(mockRouter.replace).not.toHaveBeenCalled()

      mockFetchUserInfo.mockResolvedValue(user1)
      await act(() => queryClient.refetchQueries({ queryKey: ['currentUser'] }))
      await flushRenders()

      expect(mockRouter.replace).toHaveBeenCalledWith('/account/profile')
    })
  })

  describe('when the user check fails, the form shows, and the check runs again', () => {
    it('should keep the form and what was typed while the check is pending', async () => {
      mockFetchUserInfo.mockRejectedValue(httpError(502))
      const queryClient = new QueryClient()
      const { findByRole, getByRole } = renderLogin(queryClient)
      await waitForStatus(queryClient, 'error')
      fireEvent.change(await findByRole('textbox', { name: 'Correo electrónico' }), {
        target: { value: 'user1@example.com' },
      })

      // A refetch with no cached data puts the query back in pending
      let resolveUser: (user: CurrentUserInfo) => void = () => {}
      mockFetchUserInfo.mockReturnValue(new Promise((resolve) => (resolveUser = resolve)))
      act(() => {
        queryClient.refetchQueries({ queryKey: ['currentUser'] })
      })
      await flushRenders()

      expect(queryClient.getQueryState(['currentUser'])?.status).toBe('pending')
      expect(getByRole('textbox', { name: 'Correo electrónico' })).toHaveValue('user1@example.com')

      // A confirmed logged-in user is still redirected
      await act(async () => resolveUser(user1))
      await flushRenders()
      expect(mockRouter.replace).toHaveBeenCalledWith('/account/profile')
    })
  })

  describe('when the user is logged out', () => {
    it('should stay on the login page and show the form', async () => {
      mockFetchUserInfo.mockImplementation(loggedOut)
      const queryClient = new QueryClient()
      const { getByRole } = renderLogin(queryClient)

      await waitForStatus(queryClient, 'error')
      expect(mockRouter.replace).not.toHaveBeenCalled()
      expect(getByRole('textbox', { name: 'Correo electrónico' })).toBeInTheDocument()
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
