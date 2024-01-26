import axios from 'axios'
import Env from 'utils/config/Env'

import Institution from '@/entities/Institution'

const prefix = `${Env.backendAPI}/institutions`

// Find all institutions
const GetInstitutions = async (): Promise<Institution[] | undefined> => {
  try {
    const url = `${prefix}/`
    const result = await axios.get<Institution[]>(url)
    return result.data
  } catch (error) {
    console.log(error)
    return
  }
}

export const Institutions = { GetInstitutions }
