import Interest from './Interest'
import UserAffiliation from './UserAffiliation'

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  userAffiliations: UserAffiliation[]
  interests: Interest[]
}

export default User
