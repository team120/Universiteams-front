import React from 'react'
import type { AppProps } from 'next/app'

import { useColorScheme, useHotkeys, useLocalStorage } from '@mantine/hooks'
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core'
import Layout from '../components/Layout'
import '../styles/globals.scss'

const App = ({ Component, pageProps }: AppProps) => {
    // Detect the user's theme preference (dark or light) and save it
    const preferredColorScheme = useColorScheme()
    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: 'mantine-color-scheme',
        defaultValue: preferredColorScheme,
    })
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
