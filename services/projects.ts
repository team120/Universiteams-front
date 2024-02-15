import axios from 'axios'
import Env from 'utils/config/Env'

import ProjectsResult from '@/entities/ProjectsResult'

const prefix = `${Env.backendAPI}/projects`

export interface GetProjectsInput {
  generalSearchTerm?: string
  institutionId?: number
  departmentId?: number
  interestIds?: number[]
  type?: string
  dateFrom?: Date
  isDown?: boolean
  sortBy?: string
  inAscendingOrder?: boolean
}

// Find all projects
const GetProjects = async (params?: GetProjectsInput): Promise<ProjectsResult | undefined> => {
  try {
    const url = `${prefix}`
      .concat(params ? '?' : '')
      .concat(params?.generalSearchTerm ? `generalSearch=${params.generalSearchTerm}&` : '')
      .concat(params?.institutionId ? `institutionId=${params.institutionId}&` : '')
      .concat(params?.departmentId ? `departmentId=${params.departmentId}&` : '')
      .concat(params?.interestIds ? `interestIds=${params.interestIds}&` : '')
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
}

export const Projects = { GetProjects }
