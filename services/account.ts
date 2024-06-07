import axios from 'axios'
import Env from 'utils/config/Env'
import Login from '@/entities/HelpTypes/Login'
import LoginRegisterType from '@/entities/HelpTypes/LoginRegisterType'
import { CurrentUserInfo } from './currentUser'
import { ResetPassword } from '../entities/HelpTypes/ResetPassword'

const prefix = `${Env.backendAPI}/auth`

export interface RegisterProfile {
  interestsIds: number[]
  researchDepartmentsIds: number[]
}

export const Account = {
  authenticate: async (values: Login, type: LoginRegisterType) => {
    const url = `${prefix}/${type}`
    await axios.post<CurrentUserInfo>(url, values)
  },
  registerProfile: async (values: RegisterProfile) => {
    const url = `${prefix}/register-profile`
    await axios.post(url, values)
  },
  forgotPassword: async (email: string) => {
    const url = `${prefix}/forgot-password`
    await axios.post(url, { email })
  },
  resetPassword: async (values: ResetPassword) => {
    const url = `${prefix}/reset-password`
    await axios.post(url, values)
  },
  verifyEmail: async (verificationToken: string) => {
    const url = `${prefix}/verify-email`
    await axios.post(url, { verificationToken })
  },
}
