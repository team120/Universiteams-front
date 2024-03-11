import axios, { AxiosError } from 'axios'
import Env from 'utils/config/Env'

import ProjectsResult from '@/entities/ProjectsResult'

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
  sortBy?: string
  inAscendingOrder?: boolean
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
        .concat(
          params?.sortBy
            ? `sortBy=${params.sortBy}&inAscendingOrder=${params?.inAscendingOrder ?? true}&`
            : ''
        )

      console.log(url)
      const result = await axios.get<ProjectsResult>(url)
      return result.data
    } catch (error) {
      console.log(error)
      return
    }
  },

  async bookmark(id: number): Promise<boolean> {
    try {
      await axios.post(`${prefix}/bookmark/${id}`)
      return true
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          `Failed to bookmark project with ID ${id}:`,
          error.response?.data || error.message
        )
      } else {
        console.error(`An unknown error occurred while bookmarking project with ID ${id}:`, error)
      }
      return false
    }
  },

  // Unbookmark a project
  async unbookmark(id: number): Promise<boolean> {
    try {
      await axios.delete(`${prefix}/bookmark/${id}`)
      return true
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          `Failed to unbookmark project with ID ${id}:`,
          error.response?.data || error.message
        )
      } else {
        console.error(`An unknown error occurred while unbookmarking project with ID ${id}:`, error)
      }
      return false
    }
  },
}
