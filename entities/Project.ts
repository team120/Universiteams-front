import Enrollment from './Enrollment'
import Interest from './Interest'
import ResearchDepartment from './ResearchDepartment'

export enum RequestState {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Unenrolled = 'Unenrolled',
}

interface Project {
  id: number
  name: string
  type: string
  userCount: number
  favoriteCount: number
  creationDate: string
  endDate: string
  isDown: boolean
  isFavorite?: boolean
  requestState?: RequestState
  researchDepartments: ResearchDepartment[]
  interests: Interest[]
  enrollments: Enrollment[]
}

export default Project
