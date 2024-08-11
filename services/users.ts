import axios from 'axios'
import Env from 'utils/config/Env'
import { keepPreviousData, queryOptions } from '@tanstack/react-query'

import { EnrollmentRequestsShow } from '@/entities/HelpTypes/EnrollmentRequestsShow'
import User from '@/entities/User'
import UsersResult from '@/entities/UsersResult'
import { UserSortAttribute } from '@/entities/UserInList'

const prefix = `${Env.backendAPI}/users`

export interface GetUsersInput {
  generalSearchTerm?: string
  // firstName, lastName, email
  interestIds?: number[]
  userId?: number
  sortBy?: UserSortAttribute
  inAscendingOrder?: boolean
  limit?: number
  offset?: number
}

export const Users = {
  // Find all users
  getUsers: async (params?: GetUsersInput) => {
    const url = `${prefix}`
    // To-do: use params to filter the results (general search and/or filters)
    const result = await axios.get<UsersResult>(url)
    return result.data
  },

  // Get one user by id
  getUser: async (id: number): Promise<User | undefined> => {
    const result = await axios.get<User>(`${prefix}/${id}`)
    return result.data
  },

  // Get the enrollments of a user
  async getEnrollmentRequests(id: number): Promise<EnrollmentRequestsShow> {
    const result = await axios.get<EnrollmentRequestsShow>(`${prefix}/${id}/enroll-requests`)
    return result.data
  },
}
