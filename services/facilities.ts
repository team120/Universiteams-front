import axios from 'axios'
import Env from 'utils/config/Env'

import Facility from '@/entities/Facility'

const prefix = `${Env.backendAPI}/facilities`

export interface FindFacilitiesDto {
  institutionId: number
}

const GetFacilities = async (params: FindFacilitiesDto): Promise<Facility[] | undefined> => {
  try {
    const url = `${prefix}/`
      .concat(params ? '?' : '')
      .concat(params?.institutionId ? `institutionId=${params.institutionId}&` : '')

    const result = await axios.get<Facility[]>(url)
    return result.data
  } catch (error) {
    console.log(error)
    return
  }
}

export const Facilities = { GetFacilities }
