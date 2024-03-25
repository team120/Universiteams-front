import axios, { AxiosError } from 'axios'
import Env from 'utils/config/Env'

import ErrorResponse from '@/entities/HelpTypes/ErrorResponse'
import Login from '@/entities/HelpTypes/Login'
import LoginRegisterType from '@/entities/HelpTypes/LoginRegisterType'
import { CurrentUserInfo, CurrentUserService } from './currentUser'

const prefix = `${Env.backendAPI}/auth`

export const Account = {
  Authenticate: async (values: Login, type: LoginRegisterType) => {
    try {
      const url = `${prefix}/${type}`
      await axios.post<CurrentUserInfo>(url, values, { withCredentials: true })
    } catch (error) {
      console.log(error)
      throw error as AxiosError<ErrorResponse>
    }
  },
}
