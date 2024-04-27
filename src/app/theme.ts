import { createTheme } from '@mantine/core'

// Mantine theme
const Theme = createTheme({
  primaryColor: 'blue',
  shadows: {
    md: '1px 1px 3px rgba(0, 0, 0, .25)',
    xl: '5px 5px 3px rgba(0, 0, 0, .25)',
  },
  fontFamily: 'Verdana, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: { fontFamily: 'Greycliff CF, sans-serif' },
  breakpoints: { xs: '36em', sm: '576px', md: '768px', lg: '992px', xl: '1200px' },
})

export default Theme
