import React, { useState } from 'react'
import type { AppProps } from 'next/app'

import { useColorScheme, useHotkeys } from '@mantine/hooks'
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core'
import Layout from '../components/Layout'
import '../styles/globals.scss'

const App = ({ Component, pageProps }: AppProps) => {
    // Set theme and detect the user's preference (dark or light)
    const preferredColorScheme = useColorScheme()
    const [colorScheme, setColorScheme] = useState<ColorScheme>(preferredColorScheme)
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

    useHotkeys([['mod+J', () => toggleColorScheme()]])

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
