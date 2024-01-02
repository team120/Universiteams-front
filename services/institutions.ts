import axios from 'axios'
import Institution from '@/entities/Institution'

const backendAPI = process.env.NEXT_PUBLIC_BACKEND_HOST
const prefix = `${backendAPI}/institutions`

// Find all institutions
const GetInstitutions = async (): Promise<Institution[] | undefined> => {
  try {
    const url = `${prefix}/`
    const result = await axios.get(url)
    return result.data
  } catch (error) {
    console.log(error)
    return undefined
  }
}

export const Institutions = { GetInstitutions }
