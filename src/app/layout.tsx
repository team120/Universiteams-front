'use client'
import React from 'react'
import axios from 'axios'

import { MantineProvider, localStorageColorSchemeManager } from '@mantine/core'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css';
import '@/styles/globals.scss'

import Theme from './theme'
import Layout from '@/components/Layout/Layout'

const App = ({ children, pageProps }: any) => {
  // Detect the user's theme preference (dark or light)
  const colorSchemeManager = localStorageColorSchemeManager({ key: 'mantine-color-scheme' })

  // Global configs
  axios.defaults.withCredentials = true

  return (
    <html>
      <head>
        <title>Universiteams</title>
        <meta name="description" content="Pro Scientific Dissemination & Volunteering" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <MantineProvider
          theme={Theme}
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
