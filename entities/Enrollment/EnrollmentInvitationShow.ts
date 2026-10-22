import { RequestState } from '@/entities/Project/ProjectInList'
import User from '@/entities/User/User'

export interface EnrollmentInvitationShow {
  id: number
  requestState: RequestState
  // The invitation message, written by the admin or leader
  adminMessage?: string
  // The invited user's answer, if they declined with a message
  requesterMessage?: string
  creationDate: string
  // Loaded without the user's enrollments
  user: Omit<User, 'enrollments'>
  sender: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>
}
