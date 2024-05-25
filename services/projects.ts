import axios from 'axios'
import Env from 'utils/config/Env'

import ProjectsResult from '@/entities/ProjectsResult'
import { RequestState } from '../entities/ProjectInList'
import { EnrollmentRequestInput } from '../entities/HelpTypes/EnrollmentRequestInput'
import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import Project from '../entities/Project'
import { EnrollmentRequestsShow } from '../entities/HelpTypes/EnrollmentRequestsShow'
import { EnrollmentRequestReject } from '../entities/HelpTypes/EnrollmentRequestReject'

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
    await axios.post(`${prefix}/${id}/favorite`)
  },

  async unfavorite(id: number): Promise<void> {
    await axios.delete(`${prefix}/${id}/favorite`)
  },

  async requestEnrollment(id: number, enrollmentRequest: EnrollmentRequestInput): Promise<void> {
    await axios.post(`${prefix}/${id}/enroll-request`, enrollmentRequest)
  },

  async updateEnrollmentRequest(
    id: number,
    enrollmentRequest: EnrollmentRequestInput
  ): Promise<void> {
    await axios.put(`${prefix}/${id}/enroll-request`, enrollmentRequest)
  },

  async cancelEnrollmentRequest(id: number): Promise<void> {
    await axios.delete(`${prefix}/${id}/enroll-request`)
  },

  async getEnrollmentRequests(id: number): Promise<EnrollmentRequestsShow> {
    const result = await axios.get<EnrollmentRequestsShow>(`${prefix}/${id}/enroll-requests`)
    return result.data
  },

  async unenroll(id: number, unenrollOptions: Unenroll): Promise<void> {
    await axios.put(`${prefix}/${id}/unenroll`, unenrollOptions)
  },

  async approveEnrollmentRequest(id: number, userId: number): Promise<void> {
    await axios.put(`${prefix}/${id}/enroll-requests/${userId}/approve`)
  },

  async rejectEnrollmentRequest(
    id: number,
    userId: number,
    rejectOptions: EnrollmentRequestReject
  ): Promise<void> {
    await axios.put(`${prefix}/${id}/enroll-requests/${userId}/reject`, rejectOptions)
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
