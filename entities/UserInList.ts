import Enrollment from './Enrollment'
import Interest from './Interest'
import UserAffiliation from './UserAffiliation'

export enum UserSortAttribute {
  FirstName = 'firstName',
  LastName = 'lastName',
}

interface UserInList {
  id: number
  firstName: string
  lastName: string
  email: string
  userAffiliations: UserAffiliation[]
  interests: Interest[]
  enrollments: Enrollment[]
}

export default UserInList
