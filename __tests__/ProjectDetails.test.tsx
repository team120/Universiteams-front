import '@testing-library/jest-dom/extend-expect'
import { renderWithQueryClient, screen, within } from '../utils/tests'
import ProjectDetails, { ProjectDetailsTabs } from '@/components/Project/ProjectDetails'
import { EnrollmentInvitationList } from '@/components/Enrollment/Invitation/EnrollmentInvitationList'
import { Projects } from '@/services/projects'
import Project from '@/entities/Project/Project'

let mockActiveTab: string | null = null
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/projects/1',
  useSearchParams: () => new URLSearchParams(mockActiveTab ? { activeTab: mockActiveTab } : {}),
}))
jest.mock('@react-pdf/renderer', () => ({ PDFDownloadLink: () => null }))
jest.mock('@/components/Project/ProjectPDF', () => () => null)
jest.mock('@/components/Enrollment/Invitation/EnrollmentInvitationList', () => ({
  EnrollmentInvitationList: jest.fn(() => <div data-testid="invitation-list-mock" />),
}))
jest.mock('@/services/currentUser', () => ({
  CurrentUserQueryOptions: {
    currentUser: () => ({ queryKey: ['currentUser'], queryFn: () => ({ id: 2 }) }),
  },
}))
jest.mock('@/services/projects', () => ({
  ...jest.requireActual('@/services/projects'),
  Projects: {
    getProject: jest.fn(),
    getEnrollmentRequests: jest.fn(),
  },
}))
const mockedProjects = Projects as jest.Mocked<typeof Projects>

// Only current admins and leaders get the request count
const project = (requestEnrollmentCount: number | null) =>
  ({
    id: 1,
    name: 'Proyecto A',
    type: 'Formal',
    creationDate: '2026-01-01',
    description: '',
    userCount: 1,
    favoriteCount: 0,
    researchDepartments: [],
    interests: [],
    enrollments: [],
    requestEnrollmentCount,
  } as unknown as Project)

describe('ProjectDetails invitations tab', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockActiveTab = null
    mockedProjects.getEnrollmentRequests.mockResolvedValue({
      enrollmentRequests: [],
      requestEnrollmentCount: 0,
    })
  })

  describe('when the current user is an admin', () => {
    beforeEach(() => {
      mockedProjects.getProject.mockResolvedValue(project(0))
    })

    it('should show the tab', async () => {
      renderWithQueryClient(<ProjectDetails id={1} />)

      expect(await screen.findByRole('tab', { name: 'Invitaciones' })).toBeInTheDocument()
    })

    it('should mount the list for the project only when the tab is open', async () => {
      renderWithQueryClient(<ProjectDetails id={1} />)
      await screen.findByRole('tab', { name: 'Invitaciones' })
      expect(EnrollmentInvitationList).not.toHaveBeenCalled()

      mockActiveTab = ProjectDetailsTabs.Invitations
      renderWithQueryClient(<ProjectDetails id={1} />)

      expect(await screen.findByTestId('invitation-list-mock')).toBeInTheDocument()
      expect(EnrollmentInvitationList).toHaveBeenCalledWith({ projectId: 1 }, expect.anything())
    })
  })

  describe('when the current user is not an admin', () => {
    it('should not show the tab or the list, even from a link to it', async () => {
      mockedProjects.getProject.mockResolvedValue(project(null))
      mockActiveTab = ProjectDetailsTabs.Invitations

      renderWithQueryClient(<ProjectDetails id={1} />)

      expect(await screen.findByRole('tab', { name: /Miembros/ })).toBeInTheDocument()
      expect(screen.queryByRole('tab', { name: 'Invitaciones' })).toBeNull()
      expect(EnrollmentInvitationList).not.toHaveBeenCalled()
    })

    it.each([ProjectDetailsTabs.Invitations, ProjectDetailsTabs.Requests])(
      'should show the members when a link opens the %s tab',
      async (tab) => {
        mockedProjects.getProject.mockResolvedValue(project(null))
        mockActiveTab = tab

        renderWithQueryClient(<ProjectDetails id={1} />)

        expect(await screen.findByRole('tab', { name: /Miembros/ })).toHaveAttribute(
          'aria-selected',
          'true'
        )
      }
    )
  })
})

describe('ProjectDetails test ids', () => {
  const department = (id: number, name: string) => ({
    id,
    name,
    facility: { id: 1, abbreviation: 'FRRo', institution: { id: 1, abbreviation: 'UTN' } },
  })
  const member = (id: number, firstName: string, role: string, departmentName: string) => ({
    id,
    role,
    user: {
      id,
      firstName,
      lastName: 'Test',
      interests: [{ id: 10 + id, name: `Interés de ${firstName}` }],
      userAffiliations: [{ researchDepartment: department(10 + id, departmentName) }],
    },
  })

  beforeEach(() => {
    jest.clearAllMocks()
    mockActiveTab = null
    mockedProjects.getProject.mockResolvedValue({
      ...project(null),
      researchDepartments: [department(1, 'Sistemas')],
      interests: [{ id: 1, name: 'Interés del proyecto' }],
      enrollments: [
        member(3, 'Ana', 'Leader', 'Civil'),
        member(4, 'Luis', 'Member', 'Química'),
      ],
    } as unknown as Project)
  })

  it("should scope the header to the project's own data", async () => {
    renderWithQueryClient(<ProjectDetails id={1} />)

    const header = await screen.findByTestId('project-detail-header')
    expect(within(header).getByText('Proyecto A')).toBeInTheDocument()
    expect(within(header).getByText(/Sistemas/)).toBeInTheDocument()
    expect(within(header).getByText('Interés del proyecto')).toBeInTheDocument()
    expect(within(header).queryByText(/Civil/)).toBeNull()
    expect(within(header).queryByText('Interés de Ana')).toBeNull()
  })

  it('should mark each member card with its own name and role', async () => {
    renderWithQueryClient(<ProjectDetails id={1} />)

    const members = await screen.findAllByTestId('project-member')
    expect(members).toHaveLength(2)
    expect(within(members[0]).getByText('Ana Test')).toBeInTheDocument()
    expect(within(members[0]).getByText('Lider')).toBeInTheDocument()
    expect(within(members[1]).getByText('Luis Test')).toBeInTheDocument()
    expect(within(members[1]).getByText('Miembro')).toBeInTheDocument()
  })
})
