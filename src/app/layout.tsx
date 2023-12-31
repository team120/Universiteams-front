'use client'
import React from 'react'
import Head from 'next/head'
import axios from 'axios'

import '@mantine/core/styles.css'
import {
  MantineProvider,
  createTheme,
  localStorageColorSchemeManager,
  useMantineColorScheme,
  useComputedColorScheme,
} from '@mantine/core'
import { useHotkeys } from '@mantine/hooks'
import '@/styles/globals.scss'
import Layout from '@/components/Layout'

const App = ({ children, pageProps }: any) => {
  // Detect the user's theme preference (dark or light)
  const colorSchemeManager = localStorageColorSchemeManager({ key: 'mantine-color-scheme' })

  // Mantine theme
  const theme = createTheme({
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
  })

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
        <MantineProvider
          theme={theme}
          colorSchemeManager={colorSchemeManager}
          defaultColorScheme="dark">
          <Layout>
            {children}
            {/* <Component {...pageProps} /> */}
          </Layout>
        </MantineProvider>
      </body>
    </html>
  )
}

export default App
