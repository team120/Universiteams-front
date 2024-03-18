import axios, { AxiosError } from 'axios'
import Env from 'utils/config/Env'

import ProjectsResult from '@/entities/ProjectsResult'
import { off } from 'process'

const prefix = `${Env.backendAPI}/projects`

export interface GetProjectsInput {
  generalSearchTerm?: string
  institutionId?: number
  facilityId?: number
  researchDepartmentId?: number
  interestIds?: number[]
  userId?: number
  type?: string
  dateFrom?: Date
  isDown?: boolean
  isFavorite?: boolean
  sortBy?: string
  inAscendingOrder?: boolean
  limit?: number
  offset?: number
}

export const Projects = {
  // Find all projects
  async getProjects(params?: GetProjectsInput): Promise<ProjectsResult | undefined> {
    try {
      const url = `${prefix}`
        .concat(params ? '?' : '')
        .concat(params?.generalSearchTerm ? `generalSearch=${params.generalSearchTerm}&` : '')
        .concat(params?.institutionId ? `institutionId=${params.institutionId}&` : '')
        .concat(params?.facilityId ? `facilityId=${params.facilityId}&` : '')
        .concat(
          params?.researchDepartmentId ? `researchDepartmentId=${params.researchDepartmentId}&` : ''
        )
        .concat(
          params?.interestIds && params?.interestIds.length > 0
            ? params.interestIds.map((id) => `interestIds=${id}&`).join('')
            : ''
        )
        .concat(params?.userId ? `userId=${params.userId}&` : '')
        .concat(params?.type ? `type=${params.type}&` : '')
        .concat(params?.dateFrom ? `dateFrom=${params.dateFrom.toISOString()}&` : '')
        .concat(params?.isDown ? `isDown=${params.isDown}&` : '')
        .concat(params?.isFavorite ? `isFavorite=${params.isFavorite}&` : '')
        .concat(
          params?.sortBy
            ? `sortBy=${params.sortBy}&inAscendingOrder=${params?.inAscendingOrder ?? true}&`
            : ''
        )
        .concat(params?.limit ? `limit=${params.limit}&` : '')
        .concat(params?.offset ? `offset=${params.offset}&` : '')

      console.log(url)
      const result = await axios.get<ProjectsResult>(url)
      return result.data
    } catch (error) {
      console.log(error)
      return
    }
  },

  async favorite(id: number): Promise<boolean> {
    try {
      await axios.post(`${prefix}/favorite/${id}`)
      return true
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          `Failed to favorite project with ID ${id}:`,
          error.response?.data || error.message
        )
      } else {
        console.error(`An unknown error occurred while favoriteing project with ID ${id}:`, error)
      }
      return false
    }
  },

  // Unfavorite a project
  async unfavorite(id: number): Promise<boolean> {
    try {
      await axios.delete(`${prefix}/favorite/${id}`)
      return true
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          `Failed to unfavorite project with ID ${id}:`,
          error.response?.data || error.message
        )
      } else {
        console.error(`An unknown error occurred while unfavoriteing project with ID ${id}:`, error)
      }
      return false
    }
  },
}
