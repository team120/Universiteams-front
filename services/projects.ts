import axios from 'axios'
import Project from '@/entities/Project'
import ProjectsResult from '@/entities/ProjectsResult'

const prefix = `${process.env.NEXT_PUBLIC_BACKEND_HOST}/projects`

// Find all projects
const GetProjects = async (): Promise<ProjectsResult | undefined> => {
  try {
    const url = `${prefix}/`
    const result = await axios.get<ProjectsResult>(url)
    return result.data
  } catch (error) {
    console.log(error)
    return
  }
}

export const Projects = { GetProjects }
