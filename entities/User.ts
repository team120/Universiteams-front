import UserAffiliation from './UserAffiliation'

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  userAffiliations: UserAffiliation[]
}

export default User
