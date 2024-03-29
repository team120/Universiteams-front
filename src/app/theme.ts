import { createTheme } from '@mantine/core'

// Mantine theme
const Theme = createTheme({
  primaryColor: 'blue',
  colors: {
    blue: [
      '#ebf7ff',
      '#c7e7ff',
      '#a3d6ff',
      '#7fc6ff',
      '#5bb5ff',
      '#37a5ff',
      '#138fff',
      '#0072e6',
      '#0059b3',
      '#003f80',
    ],
    red: [
      '#fff1f1',
      '#ffcccc',
      '#ff9999',
      '#ff6666',
      '#ff3333',
      '#ff0000',
      '#e60000',
      '#b30000',
      '#800000',
      '#4d0000',
    ],
    violet: [
      '#f3ebff',
      '#e4ccff',
      '#d5adff',
      '#c68eff',
      '#b76fff',
      '#a850ff',
      '#9a31ff',
      '#8b12ff',
      '#7a00e6',
      '#6600b3',
    ],
    teal: [
      '#e6fffa',
      '#b3f5f1',
      '#80ebe8',
      '#4ddfdf',
      '#26cfc6',
      '#00bfb3',
      '#00a99f',
      '#008c83',
      '#006d66',
      '#004d49',
    ],
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
    pink: [
      '#fff0f6',
      '#ffd6e8',
      '#ffadd6',
      '#ff85c4',
      '#ff5cb2',
      '#ff33a0',
      '#ff0090',
      '#e6007a',
      '#b3005f',
      '#800044',
    ],
    dimmed: [
      '#f9f9f9',
      '#f2f2f2',
      '#ebebeb',
      '#e4e4e4',
      '#dddddd',
      '#d6d6d6',
      '#cfcfcf',
      '#c8c8c8',
      '#c1c1c1',
      '#bababa',
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
