import ResearchDepartment from '@/entities/ResearchDepartment'
import axios from 'axios'
import Env from 'utils/config/Env'

const prefix = `${Env.backendAPI}/research-departments`

export interface FindDepartmentsDto {
  facilityId: number
}

export const ResearchDepartments = {
  getResearchDepartments: async (
    params: FindDepartmentsDto
  ): Promise<ResearchDepartment[] | undefined> => {
    try {
      const url = `${prefix}`
        .concat(params ? '?' : '')
        .concat(params?.facilityId ? `facilityId=${params.facilityId}&` : '')

      const result = await axios.get<ResearchDepartment[]>(url)
      return result.data
    } catch (error) {
      console.log(error)
      return
    }
  },
}
