'use client'
import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'

import { Institutions } from '@/services/institutions'
import Institution from '@/entities/Institution'

const Home: NextPage = () => {
  const [dataTest, setDataTest] = useState<Institution[]>([])

  const getInstitutions = async () => {
    const institutions: Institution[] | undefined = await Institutions.getInstitutions()
    if (institutions) setDataTest(institutions)
  }

  useEffect(() => {
    getInstitutions()
  }, [])

  return (
    <>
      <Head>
        <title>Universiteams</title>
        <meta name="description" content="Pro Scientific Dissemination & Volunteering" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mainContainer">
        <h1>Universiteams</h1>
        <h3>Test names:</h3>
        <ul>
          {dataTest?.length > 0 &&
            dataTest.map((item: Institution, i: number) => <li key={i}>{item.name}</li>)}
        </ul>
      </main>
    </>
  )
}

export default Home
