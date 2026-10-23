import '@testing-library/jest-dom/extend-expect'
import { renderWithQueryClient, screen } from '../utils/tests'
import ProjectItem from '@/components/Project/ProjectItem'
import { ProjectRole } from '@/entities/Enrollment/Enrollment'
import ProjectInList from '@/entities/Project/ProjectInList'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/projects',
  useSearchParams: () => new URLSearchParams(),
}))
jest.mock('@react-pdf/renderer', () => ({ PDFDownloadLink: () => null }))
jest.mock('@/components/Project/ProjectPDF', () => () => null)
jest.mock('@/services/currentUser', () => ({
  CurrentUserQueryOptions: {
    currentUser: () => ({ queryKey: ['currentUser'], queryFn: () => null }),
  },
}))

const project = (enrollments: ProjectInList['enrollments']) =>
  ({
    id: 1,
    name: 'Proyecto A',
    type: 'Formal',
    creationDate: '2026-01-01',
    userCount: 3,
    favoriteCount: 0,
    researchDepartments: [],
    interests: [],
    enrollments,
  } as unknown as ProjectInList)

describe('ProjectItem', () => {
  it('should show the leader even if an admin comes first', () => {
    renderWithQueryClient(
      <ProjectItem
        project={project([
          {
            id: 2,
            role: ProjectRole.Admin,
            user: { id: 6, firstName: 'Ana', lastName: 'Admin' },
          },
          {
            id: 1,
            role: ProjectRole.Leader,
            user: { id: 5, firstName: 'Camila', lastName: 'Villa' },
          },
        ] as ProjectInList['enrollments'])}
      />
    )

    expect(screen.getByTestId('project-card-leader')).toHaveTextContent('Camila Villa, +2 personas')
  })

  it('should render a project with no current leader, with its member count', () => {
    renderWithQueryClient(<ProjectItem project={project([])} />)

    expect(screen.getByText('Proyecto A')).toBeInTheDocument()
    expect(screen.queryByTestId('project-card-leader')).toBeNull()
    expect(screen.getByTestId('project-card-members')).toHaveTextContent('3 personas')
  })

  it('should expose the card and its title by test id, so UI tests can scope to one project', () => {
    renderWithQueryClient(<ProjectItem project={project([])} />)

    const card = screen.getByTestId('project-card')
    expect(card).toContainElement(screen.getByTestId('project-card-title'))
    expect(screen.getByTestId('project-card-title')).toHaveTextContent('Proyecto A')
  })
})
