import { createTheme } from '@mantine/core'

// Mantine theme
const Theme = createTheme({
  primaryColor: 'blue',
  colors: {
    orange: [
      '#fef2e7',
      '#fbd8b7',
      '#f8bf87',
      '#f5a557',
      '#f28b27',
      '#d8720d',
      '#a8580a',
      '#783f07',
      '#482604',
      '#180d01',
    ],
  },
  shadows: {
    md: '1px 1px 3px rgba(0, 0, 0, .25)',
    xl: '5px 5px 3px rgba(0, 0, 0, .25)',
  },
  fontFamily: 'Verdana, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: { fontFamily: 'Greycliff CF, sans-serif' },
  spacing: { xs: '15', sm: '20', md: '25', lg: '30', xl: '40' },
  breakpoints: { xs: '36em', sm: '576px', md: '768px', lg: '992px', xl: '1200px' },
})

export default Theme
