import User from '../User'

export interface EnrollmentRequestShow {
  id: number
  requesterMessage: string
  creationDate: string
  user: User
}
