import axios, { AxiosError } from 'axios'
import Env from 'utils/config/Env'

import ErrorResponse from '@/entities/HelpTypes/ErrorResponse'
import Login from '@/entities/HelpTypes/Login'
import LoginRegisterType from '@/entities/HelpTypes/LoginRegisterType'

const prefix = `${Env.backendAPI}/auth`

const Auth = async (values: Login, type: LoginRegisterType): Promise<any> => {
  try {
    const url = `${prefix}/${type}`
    const result = await axios.post(url, values, { withCredentials: true })
    return result.data
  } catch (error) {
    console.log(error)
    return error as AxiosError<ErrorResponse>
  }
}

export const Account = { Auth }
