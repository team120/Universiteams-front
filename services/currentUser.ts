import axios from 'axios'
import Env from '../utils/config/Env'
import { QueryOptions, queryOptions } from '@tanstack/react-query'

export interface CurrentUserInfo {
  user: string
  email: string
  isEmailVerified: boolean
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

export const CurrentUserQueryOptions = {
  currentUser: () =>
    queryOptions({
      queryKey: ['currentUser'],
      queryFn: CurrentUserService.fetchUserInfo,
    }),
}
