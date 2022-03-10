import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import styles from '../styles/home.module.scss'

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Universiteams</title>
                <meta name="description" content="Pro Scientific Dissemination & Volunteering" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1>Universiteams</h1>
            </main>

            <footer className={styles.footer}>
                <p>Testing Phase</p>
            </footer>
        </div>
    )
}

export default Home
