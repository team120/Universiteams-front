'use client'
import React from 'react'
import type { NextPage } from 'next'

import LoginRegister from '@/components/Account/LoginRegister'

const Register: NextPage = () => {
  return <LoginRegister initialType="register" />
}

export default Register
