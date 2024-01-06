'use client'
import React from 'react'
import type { NextPage } from 'next'

import LoginRegister from '@/components/Account/LoginRegister'

const Login: NextPage = () => {
  return <LoginRegister initialType="login" />
}

export default Login
