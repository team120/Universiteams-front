import axios from 'axios'
import Env from 'utils/config/Env'

import Login from '@/entities/HelpTypes/Login'
import LoginRegisterType from '@/entities/HelpTypes/LoginRegisterType'
import { CurrentUserInfo } from './currentUser'

const prefix = `${Env.backendAPI}/auth`

export const Account = {
  Authenticate: async (values: Login, type: LoginRegisterType) => {
    const url = `${prefix}/${type}`
    await axios.post<CurrentUserInfo>(url, values, { withCredentials: true })
  },
}
