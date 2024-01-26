import axios from 'axios'
import Env from 'utils/config/Env'

import Project from '@/entities/Project'
import ProjectsResult from '@/entities/ProjectsResult'

const prefix = `${Env.backendAPI}/projects`

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
