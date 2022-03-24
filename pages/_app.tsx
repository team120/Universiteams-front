import React, { useState } from 'react'
import type { AppProps } from 'next/app'

import { useColorScheme } from '@mantine/hooks'
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core'
import Layout from '../components/Layout'
import '../styles/globals.scss'

// Set theme and detect the user's preference (dark or light)
const preferredColorScheme = useColorScheme()
const [colorScheme, setColorScheme] = useState<ColorScheme>(preferredColorScheme)
const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
                <Layout className={'container'}>
                    <Component {...pageProps} />
                </Layout>
            </MantineProvider>
        </ColorSchemeProvider>
    )
}

export default App
