import '@testing-library/jest-dom/extend-expect'
import { renderWithQueryClient, screen } from '../utils/tests'
import ProjectsList from '@/components/Project/ProjectsList'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/projects',
  useSearchParams: () => new URLSearchParams(),
}))
jest.mock('@react-pdf/renderer', () => ({ PDFDownloadLink: () => null }))
jest.mock('@/components/Project/ProjectPDF', () => () => null)

describe('ProjectsList', () => {
  it('should say no projects were found when the list is empty', () => {
    renderWithQueryClient(<ProjectsList projects={[]} />)

    expect(screen.getByText('No se encontraron proyectos')).toBeInTheDocument()
    expect(screen.queryByText('Aún no tienes proyectos')).toBeNull()
  })
})
