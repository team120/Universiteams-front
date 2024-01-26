import axios from 'axios'
import Institution from '@/entities/Institution'

const prefix = `${process.env.NEXT_PUBLIC_BACKEND_HOST}/institutions`

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
