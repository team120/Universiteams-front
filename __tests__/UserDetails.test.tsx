import '@testing-library/jest-dom/extend-expect'
import { renderWithQueryClient, screen } from '../utils/tests'
import UserDetails from '@/components/User/UserDetails'
import { CurrentUserInfo, UserSystemRole } from '@/services/currentUser'
import { Users } from '@/services/users'
import Enrollment, { ProjectRole } from '@/entities/Enrollment/Enrollment'
import User from '@/entities/User/User'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/users/8',
  useSearchParams: () => new URLSearchParams(),
}))
jest.mock('@react-pdf/renderer', () => ({ PDFDownloadLink: () => null }))
jest.mock('@/components/User/UserPDF', () => () => null)
jest.mock('@/services/users', () => ({ Users: { getUser: jest.fn() } }))
const mockFetchUserInfo = jest.fn()
jest.mock('@/services/currentUser', () => ({
  ...jest.requireActual('@/services/currentUser'),
  CurrentUserQueryOptions: {
    currentUser: () => ({ queryKey: ['currentUser'], queryFn: () => mockFetchUserInfo() }),
  },
}))
const mockedUsers = Users as jest.Mocked<typeof Users>

const user = (id: number, firstName: string, enrollments: Enrollment[] = []) =>
  ({
    id,
    firstName,
    lastName: 'Pérez',
    email: `user${id}@example.com`,
    userAffiliations: [],
    interests: [],
    enrollments,
  } as User)

const leaderEnrollment = {
  id: 1,
  role: ProjectRole.Leader,
  project: { id: 10, name: 'Proyecto A' },
} as Enrollment

describe('UserDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedUsers.getUser.mockImplementation(async (id: number) =>
      id === 8 ? user(8, 'Ana') : user(2, 'Camila', [leaderEnrollment])
    )
  })

  describe('when the visitor is not logged in', () => {
    it('should show the profile without the invite button', async () => {
      mockFetchUserInfo.mockRejectedValue(new Error('401'))

      renderWithQueryClient(<UserDetails id={8} />)

      expect(await screen.findByText('Ana Pérez')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Invitar a un proyecto' })).toBeNull()
      expect(mockedUsers.getUser).toHaveBeenCalledTimes(1)
      expect(mockedUsers.getUser).toHaveBeenCalledWith(8)
    })
  })

  describe('when the current user leads a project the user is not in', () => {
    it('should show the invite button', async () => {
      const currentUser: CurrentUserInfo = {
        id: 2,
        user: 'Camila',
        email: 'user2@example.com',
        isEmailVerified: true,
        systemRole: UserSystemRole.USER,
      }
      mockFetchUserInfo.mockResolvedValue(currentUser)

      renderWithQueryClient(<UserDetails id={8} />)

      expect(
        await screen.findByRole('button', { name: 'Invitar a un proyecto' })
      ).toBeInTheDocument()
    })
  })
})
