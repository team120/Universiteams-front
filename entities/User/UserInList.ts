import Enrollment from '@/entities/Enrollment/Enrollment'
import Interest from '@/entities/Interest'
import UserAffiliation from './UserAffiliation'

export enum UserSortAttribute {
  LastName = 'lastName',
}

interface UserInList {
  id: number
  firstName: string
  lastName: string
  email: string
  requestEnrollmentInvitationsCount: number
  userAffiliations: UserAffiliation[]
  interests: Interest[]
  enrollments: Enrollment[]
}

export default UserInList
