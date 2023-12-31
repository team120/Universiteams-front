'use client'
import React from 'react'
import axios from 'axios'
import Head from 'next/head'

// import type { NextPage } from 'next'
// import type { AppProps } from 'next/app'

import { useColorScheme, useHotkeys, useLocalStorage } from '@mantine/hooks'
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core'
import '@/styles/globals.scss'
import Layout from '@/components/Layout'

interface App {
  children: React.ReactNode
  pageProps?: any
}

const App = ({ children, pageProps }: App) => {
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
      <Head>
        <title>Universiteams</title>
        <meta name="description" content="Pro Scientific Dissemination & Volunteering" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider theme={themeConfig} withGlobalStyles withNormalizeCSS>
            <Layout>
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
