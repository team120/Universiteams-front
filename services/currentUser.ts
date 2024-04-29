import axios from 'axios'
import Env from '../utils/config/Env'

export interface CurrentUserInfo {
  user: string
  email: string
}

const prefix = `${Env.backendAPI}/auth`

export const CurrentUserService = {
  async fetchUserInfo(): Promise<CurrentUserInfo | null> {
    const response = await axios.get<CurrentUserInfo>(`${prefix}/me`, {
      withCredentials: true,
    })

    return response.data
  },
}
