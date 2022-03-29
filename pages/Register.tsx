import React from 'react'
import type { NextPage } from 'next'

import LoginRegister from '../components/LoginRegister'

const Register: NextPage = () => {
    return <LoginRegister initialType="register" />
}

export default Register
