import ProjectInList from './ProjectInList'
import User from './User'

export enum ProjectRole {
  Leader = 'Leader',
  Admin = 'Admin',
  Member = 'Member',
}

interface Enrollment {
  id: number
  role: ProjectRole
  user: User
  project: ProjectInList
}

export default Enrollment
