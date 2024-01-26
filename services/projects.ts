import axios from 'axios'
import Project from '@/entities/Project'

const backendAPI = process.env.NEXT_PUBLIC_BACKEND_HOST
const prefix = `${backendAPI}/projects`

// Find all projects
const GetProjects = async (): Promise<Project[] | undefined> => {
  try {
    const url = `${prefix}/`
    const result = await axios.get<Project[]>(url)
    return result.data
  } catch (error) {
    console.log(error)
    return
  }
}

export const Projects = { GetProjects }
