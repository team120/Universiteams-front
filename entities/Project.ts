import Enrollment from './Enrollment'
import Interest from './Interest'
import ResearchDepartment from './ResearchDepartment'

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
  researchDepartments: ResearchDepartment[]
  interests: Interest[]
  enrollments: Enrollment[]
}

export default Project
