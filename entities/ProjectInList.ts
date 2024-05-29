import Enrollment from './Enrollment'
import Interest from './Interest'
import ResearchDepartment from './ResearchDepartment'

export enum ProjectSortAttribute {
  Name = 'name',
  CreationDate = 'creationDate',
  RequestEnrollmentCount = 'requestEnrollmentCount',
}

export enum RequestState {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Unenrolled = 'Unenrolled',
}

interface ProjectInList {
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
  requesterMessage?: string
  adminMessage?: string
  requestEnrollmentCount?: number
  researchDepartments: ResearchDepartment[]
  interests: Interest[]
  enrollments: Enrollment[]
}

export default ProjectInList
