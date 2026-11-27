import '@testing-library/jest-dom/extend-expect'
import { render, screen, userEvent, waitFor } from '../utils/tests'
import SearchBar from '@/components/Common/SearchBar/SearchBar'

let mockSearch = ''
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/projects',
  useSearchParams: () => new URLSearchParams(mockSearch),
}))

// Longer than the search box's 400 ms debounce
const afterDebounce = { timeout: 1000 }

describe('SearchBar', () => {
  beforeEach(() => {
    mockSearch = ''
    mockPush.mockClear()
  })

  describe('when the page opens with a search in the URL', () => {
    it('should show the search in the box and keep it in the URL', async () => {
      mockSearch = 'generalSearch=cebada&university=1'
      render(<SearchBar />)

      expect(screen.getByRole('textbox')).toHaveValue('cebada')
      await new Promise((resolve) => setTimeout(resolve, 600))
      for (const [url] of mockPush.mock.calls) {
        expect(url).toContain('generalSearch=cebada')
      }
    })
  })

  describe('when the user types a search', () => {
    it('should add it to the URL, keeping the other filters', async () => {
      mockSearch = 'university=1'
      render(<SearchBar />)

      await userEvent.type(screen.getByRole('textbox'), 'cebada')

      await waitFor(
        () =>
          expect(mockPush).toHaveBeenLastCalledWith('/projects?university=1&generalSearch=cebada'),
        afterDebounce
      )
    })
  })

  describe('when the user clears the search', () => {
    it('should remove it from the URL, keeping the other filters', async () => {
      mockSearch = 'generalSearch=cebada&university=1'
      render(<SearchBar />)

      await userEvent.click(screen.getByRole('button', { name: 'Limpiar búsqueda', hidden: true }))

      await waitFor(
        () => expect(mockPush).toHaveBeenLastCalledWith('/projects?university=1'),
        afterDebounce
      )
    })
  })
})
