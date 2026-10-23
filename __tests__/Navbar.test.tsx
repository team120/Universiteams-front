import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppShell } from '@mantine/core'
import '@testing-library/jest-dom/extend-expect'
import mockRouter from 'next-router-mock'
import { render, screen, userEvent, waitFor } from '../utils/tests'
import Navbar from '@/components/Layout/Navbar/Navbar'
import { CurrentUserInfo } from '@/services/currentUser'
import { Account } from '@/services/account'

jest.mock('next/navigation', () => require('next-router-mock'))
jest.mock('@/services/account', () => ({ Account: { logout: jest.fn() } }))

const user1 = { id: 1, user: 'Juan Rizzo', email: 'user1@example.com' } as CurrentUserInfo
jest.mock('@/services/currentUser', () => ({
  ...jest.requireActual('@/services/currentUser'),
  CurrentUserQueryOptions: {
    currentUser: () => ({
      queryKey: ['currentUser'],
      queryFn: () => user1,
      retry: false,
    }),
  },
}))

describe('Navbar', () => {
  describe('when the user logs out', () => {
    it('should clear the cached user and go to the login page', async () => {
      ;(Account.logout as jest.Mock).mockResolvedValue(undefined)
      mockRouter.setCurrentUrl('/projects')
      const queryClient = new QueryClient()
      queryClient.setQueryData(['currentUser'], user1)
      render(
        <QueryClientProvider client={queryClient}>
          <AppShell>
            <Navbar />
          </AppShell>
        </QueryClientProvider>
      )

      await userEvent.click(screen.getByText('Juan Rizzo'))
      await userEvent.click(screen.getByText('Cerrar Sesión'))

      await waitFor(() => expect(mockRouter.asPath).toBe('/account/login'))
      expect(queryClient.getQueryData(['currentUser'])).toBeNull()
      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument()
    })
  })
})
