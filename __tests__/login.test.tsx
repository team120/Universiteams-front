import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, fireEvent, waitFor } from '../utils/tests'
import '@testing-library/jest-dom/extend-expect' // Import the matchers
import mockRouter from 'next-router-mock'
import Login from 'src/app/account/login/page'
import { CurrentUserInfo } from '@/services/currentUser'

jest.mock('next/navigation', () => require('next-router-mock'))

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

describe('Login page', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl('/account/login')
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

      await waitFor(() => expect(mockRouter.asPath).toBe('/account/profile'))
    })
  })

  describe('when the user is logged out', () => {
    it('should stay on the login page', async () => {
      mockFetchUserInfo.mockImplementation(loggedOut)
      renderLogin()

      await waitFor(() => expect(mockFetchUserInfo).toHaveBeenCalled())
      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(mockRouter.asPath).toBe('/account/login')
    })

    it('should not redirect to the profile once they log in on this page', async () => {
      mockFetchUserInfo.mockImplementation(loggedOut)
      const queryClient = new QueryClient()
      renderLogin(queryClient)
      await waitFor(() => expect(queryClient.getQueryState(['currentUser'])?.status).toBe('error'))

      // What a successful login does: the current user is refetched
      mockFetchUserInfo.mockResolvedValue(user1)
      await queryClient.refetchQueries({ queryKey: ['currentUser'] })

      expect(queryClient.getQueryData(['currentUser'])).toEqual(user1)
      expect(mockRouter.asPath).toBe('/account/login')
    })
  })
})
