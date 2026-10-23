'use client'
import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Center, Loader } from '@mantine/core'

import LoginRegister from '@/components/Account/LoginRegister'
import { CurrentUserQueryOptions } from '@/services/currentUser'

const Login: NextPage = () => {
  const router = useRouter()
  const {
    data: currentUser,
    error,
    status,
    isFetchedAfterMount,
    isFetching,
  } = useQuery(CurrentUserQueryOptions.currentUser())
  // Only a 401 (or no user) means logged out; other errors leave it unknown
  const isLoggedOut =
    (status === 'error' && axios.isAxiosError(error) && error.response?.status === 401) ||
    (status === 'success' && !currentUser)
  // Set once the page knows the user is logged out, so logging in here keeps its own redirect
  const [wasLoggedOut, setWasLoggedOut] = useState(false)

  useEffect(() => {
    if (isLoggedOut) setWasLoggedOut(true)
    // Only a user fetched since the page opened counts: a cached one may have expired
    else if (status === 'success' && isFetchedAfterMount && !isFetching && !wasLoggedOut)
      router.replace('/account/profile')
  }, [isLoggedOut, status, isFetchedAfterMount, isFetching, wasLoggedOut, router])

  // Until the page knows, a loader, so a logged-in user doesn't see the form before the redirect
  if (!wasLoggedOut && !isLoggedOut && status !== 'error')
    return (
      <Center mt="xl">
        <Loader />
      </Center>
    )

  return <LoginRegister initialType="login" />
}

export default Login
