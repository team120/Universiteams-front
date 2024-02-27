import Project from './Project'

// Projects with complementary info
interface ProjectsResult {
  projects: Project[]
  suggestedSearchTerms?: string[]
  projectCount: number
}

export default ProjectsResult
