import ProjectInList from './ProjectInList'
import User from './User'

interface Enrollment {
  id: number
  role: string
  user: User
  project: ProjectInList
}

export default Enrollment
