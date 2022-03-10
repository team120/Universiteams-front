import React from 'react'
import type { AppProps } from 'next/app'

import Layout from '../components/Layout'
import '../styles/globals.scss'

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <div>
            <Layout className={'container'}>
                <Component {...pageProps} />
            </Layout>
        </div>
    )
}

export default App
