'use client'
import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'

import { Institutions } from '@/services/institutions'
import Institution from '@/entities/Institution'
import styles from '@/styles/home.module.scss'

const Home: NextPage = () => {
  const [dataTest, setDataTest] = useState<Institution[]>([])

  const getInstitutions = async () => {
    const institutions: Institution[] | undefined = await Institutions.GetInstitutions()
    if (institutions) setDataTest(institutions)
  }

  useEffect(() => {
    getInstitutions()
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
          {dataTest?.length > 0 &&
            dataTest.map((item: Institution, i: number) => <li key={i}>{item.name}</li>)}
        </ul>
      </main>

      {/* <LoginRegister initialType="login" /> */}

      <footer className={styles.footer}>
        <p>Testing Phase</p>
      </footer>
    </div>
  )
}

export default Home
