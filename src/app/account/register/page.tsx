'use client'
import React from 'react'
import type { NextPage } from 'next'

import LoginRegister from '@/components/account/LoginRegister'

const Register: NextPage = () => {
  return <LoginRegister initialType="register" />
}

export default Register
