'use client'
import React from 'react'
import axios from 'axios'

// import type { NextPage } from 'next'
// import type { AppProps } from 'next/app'

import { useColorScheme, useHotkeys, useLocalStorage } from '@mantine/hooks'
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core'
import '@/styles/globals.scss'
import Layout from '@/components/Layout'

interface Layout {
  children: React.ReactNode
  pageProps: any
}

const App = ({ children, pageProps }: Layout) => {
  // Detect the user's theme preference (dark or light) and save it
  const preferredColorScheme = useColorScheme()
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: preferredColorScheme,
  })
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))
  const themeConfig: any = {
    colorScheme,
    primaryColor: 'blue',
    secondaryColor: 'orange',
    fontFamily: 'Verdana, sans-serif',
    fontFamilyMonospace: 'Monaco, Courier, monospace',
    headings: { fontFamily: 'Greycliff CF, sans-serif' },
    spacing: { xs: 15, sm: 20, md: 25, lg: 30, xl: 40 },
    loader: 'bars',
  }

  // Hotkeys
  useHotkeys([['mod+J', () => toggleColorScheme()]])

  // Global configs
  axios.defaults.withCredentials = true

  return (
    <html>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </head>
      <body>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider theme={themeConfig} withGlobalStyles withNormalizeCSS>
            <Layout className={'container'}>
              {children}
              {/* <Component {...pageProps} /> */}
            </Layout>
          </MantineProvider>
        </ColorSchemeProvider>
      </body>
    </html>
  )
}

export default App
