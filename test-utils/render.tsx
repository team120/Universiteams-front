import { render as testingLibraryRender } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'

import Theme from 'src/app/theme'

export function render(ui: React.ReactNode) {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <MantineProvider theme={Theme}>{children}</MantineProvider>
    ),
  })
}
