import User from '@/entities/User'
import axios from 'axios'
import Env from 'utils/config/Env'

const prefix = `${Env.backendAPI}/users`

const GetUsers = async () => {
  try {
    const url = `${prefix}`
    const result = await axios.get<User[]>(url)
    return result.data
  } catch (error) {
    console.log(error)
    return
  }
}

export const Users = { GetUsers }
