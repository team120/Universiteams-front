import '../styles/globals.scss'
import type { AppProps } from 'next/app'

import Layout from '../components/Layout'

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
