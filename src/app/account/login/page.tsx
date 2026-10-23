'use client'
import React, { useEffect, useRef } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import LoginRegister from '@/components/Account/LoginRegister'
import { CurrentUserQueryOptions } from '@/services/currentUser'

const Login: NextPage = () => {
  const router = useRouter()
  const {
    data: currentUser,
    status,
    isFetchedAfterMount,
    isFetching,
  } = useQuery(CurrentUserQueryOptions.currentUser())
  // Set once the page knows the user is logged out, so logging in here keeps its own redirect
  const wasLoggedOut = useRef(false)

  useEffect(() => {
    if (status === 'error' || (status === 'success' && !currentUser)) wasLoggedOut.current = true
    // Only a user fetched since the page opened counts: a cached one may have expired
    else if (status === 'success' && isFetchedAfterMount && !isFetching && !wasLoggedOut.current)
      router.replace('/account/profile')
  }, [status, currentUser, isFetchedAfterMount, isFetching, router])

  return <LoginRegister initialType="login" />
}

export default Login
