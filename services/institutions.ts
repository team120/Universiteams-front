import axios from 'axios'
import Env from 'utils/config/Env'

import Institution from '@/entities/Institution'

const prefix = `${Env.backendAPI}/institutions`

export const Institutions = {
  getInstitutions: async (): Promise<Institution[] | undefined> => {
    const url = `${prefix}/`
    const result = await axios.get<Institution[]>(url)
    return result.data
  },
}
