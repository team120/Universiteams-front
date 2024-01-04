import { render as testingLibraryRender } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'

import Theme from 'src/app/theme'

export function render(ui: React.ReactNode) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })

  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <MantineProvider theme={Theme}>{children}</MantineProvider>
    ),
  })
}
