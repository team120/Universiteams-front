import Project from './Project'
import User from './User'

interface Enrollment {
  id: number
  role: string
  user: User
  project: Project
}

export default Enrollment
