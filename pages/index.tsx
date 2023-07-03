import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import axios from 'axios'
import Head from 'next/head'
import Image from 'next/image'

import styles from '../styles/home.module.scss'
import Dropdown from '../components/Dropdown'

const Home: NextPage = () => {
    const [dataTest, setDataTest] = useState([])
    // const backend_api = process.env.BACKEND_HOST
    const backend_api = 'http://api.localhost'

    useEffect(() => {
        const url = `${backend_api}/institutions/`
        axios.get(url).then((res) => {
            setDataTest(res.data)
        })
    }, [])

    return (
        <div className={styles.container}>
            <Head>
                <title>Universiteams</title>
                <meta name="description" content="Pro Scientific Dissemination & Volunteering" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1>Universiteams</h1>
                <h3>Test names:</h3>
                <ul>
                    {dataTest.map((item: any, i: number) => (
                        <li key={i}>{item.name}</li>
                    ))}
                </ul>

                <Dropdown />
            </main>

            <footer className={styles.footer}>
                <p>Testing Phase</p>
            </footer>
        </div>
    )
}

export default Home
