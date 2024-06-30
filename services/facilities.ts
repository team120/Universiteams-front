import axios from 'axios'
import Env from 'utils/config/Env'

import Facility from '@/entities/Facility'

const prefix = `${Env.backendAPI}/facilities`

export interface FindFacilitiesDto {
  institutionId: number
}

export const Facilities = {
  getFacilities: async (params: FindFacilitiesDto): Promise<Facility[] | undefined> => {
    const url = `${prefix}/`
      .concat(params ? '?' : '')
      .concat(params?.institutionId ? `institutionId=${params.institutionId}&` : '')

    const result = await axios.get<Facility[]>(url)
    return result.data
  },
}
