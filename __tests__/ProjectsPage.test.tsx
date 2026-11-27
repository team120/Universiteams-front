import '@testing-library/jest-dom/extend-expect'
import axios from 'axios'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '../utils/tests'
import ProjectsPage from 'src/app/projects/page'

let mockSearch = ''
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/projects',
  useSearchParams: () => new URLSearchParams(mockSearch),
}))
jest.mock('axios')
jest.mock('@/components/Common/Filter/Filter', () => ({
  __esModule: true,
  default: ({ counter, children }: { counter: number; children: React.ReactNode }) => (
    <div>
      <span>{counter} Resultados</span>
      {children}
    </div>
  ),
}))
jest.mock('@/components/Project/ProjectFilterContent', () => () => null)
jest.mock('@/components/Project/ProjectsList', () => ({
  __esModule: true,
  default: ({ projects }: { projects?: { id: number }[] }) => (
    <div>{projects?.length ?? 0} proyectos en la lista</div>
  ),
}))

const mockedGet = axios.get as jest.Mock

describe('ProjectsPage', () => {
  beforeEach(() => {
    mockSearch = ''
    mockedGet.mockImplementation((url: string) => {
      if (url.includes('generalSearch=ce')) return Promise.reject(new Error('Request failed'))
      if (url.includes('/projects')) {
        return Promise.resolve({ data: { projects: [{ id: 1 }, { id: 2 }], projectCount: 2 } })
      }
      return Promise.resolve({ data: [] })
    })
  })

  it('should show an error, not the previous results, when the search request fails', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const page = (
      <QueryClientProvider client={queryClient}>
        <ProjectsPage />
      </QueryClientProvider>
    )
    const { rerender } = render(page)
    expect(await screen.findByText('2 proyectos en la lista')).toBeInTheDocument()

    mockSearch = 'generalSearch=ce'
    rerender(page)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se pudieron cargar los proyectos'
    )
    await waitFor(() => expect(screen.queryByText('2 proyectos en la lista')).toBeNull())
    expect(screen.getByText('0 Resultados')).toBeInTheDocument()
  })
})
