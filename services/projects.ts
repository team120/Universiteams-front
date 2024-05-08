import axios, { AxiosError } from 'axios'
import Env from 'utils/config/Env'

import ProjectsResult from '@/entities/ProjectsResult'
import Project, { RequestState } from '../entities/Project'
import { EnrollmentRequest } from '../entities/HelpTypes/EnrollmentRequest'
import { UseMutationOptions, keepPreviousData, queryOptions } from '@tanstack/react-query'

const prefix = `${Env.backendAPI}/projects`

export interface GetProjectsInput {
  generalSearchTerm?: string
  institutionId?: number
  facilityId?: number
  researchDepartmentId?: number
  interestIds?: number[]
  userId?: number
  type?: string
  requestState?: RequestState
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
      .concat(params?.requestState ? `requestState=${params.requestState}&` : '')
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
  },

  async getProject(id: number): Promise<Project | undefined> {
    const result = await axios.get<Project>(`${prefix}/${id}`)
    return result.data
  },

  async favorite(id: number): Promise<void> {
    await axios.post(`${prefix}/favorite/${id}`)
  },

  async unfavorite(id: number): Promise<void> {
    await axios.delete(`${prefix}/favorite/${id}`)
  },

  async requestEnrollment(id: number, enrollmentRequest: EnrollmentRequest): Promise<void> {
    await axios.post(`${prefix}/enroll-request/${id}`, enrollmentRequest)
  },

  async updateEnrollmentRequest(id: number, enrollmentRequest: EnrollmentRequest): Promise<void> {
    await axios.put(`${prefix}/enroll-request/${id}`, enrollmentRequest)
  },

  async cancelEnrollmentRequest(id: number): Promise<void> {
    await axios.delete(`${prefix}/enroll-request/${id}`)
  },

  async unenroll(id: number, unenrollOptions: Unenroll): Promise<void> {
    await axios.put(`${prefix}/unenroll/${id}`, unenrollOptions)
  },
}

export const ProjectsQueryKey = 'projects'

export const ProjectQueryOptions = {
  projects: (currentPage: number, projectsPerPage: number, params?: GetProjectsInput) =>
    queryOptions({
      queryKey: [ProjectsQueryKey, params, currentPage, projectsPerPage],
      queryFn: () => Projects.getProjects(params),
      placeholderData: keepPreviousData,
    }),
}
