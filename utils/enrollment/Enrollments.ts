import Enrollment, { ProjectRole } from '@/entities/Enrollment/Enrollment'
import ProjectInList from '@/entities/Project/ProjectInList'
import User from '@/entities/User/User'

// A user profile only lists accepted enrollments, so these are the projects the
// current user leads or administers today
const invitableProjects = (currentUser: User, user: User): ProjectInList[] => {
  if (currentUser.id === user.id) return []

  const userProjectIds = new Set(user.enrollments.map((enrollment) => enrollment.project.id))

  return currentUser.enrollments
    .filter(
      (enrollment) =>
        (enrollment.role === ProjectRole.Leader || enrollment.role === ProjectRole.Admin) &&
        !userProjectIds.has(enrollment.project.id)
    )
    .map((enrollment) => enrollment.project)
}

// The list embeds the project's leaders and admins in no fixed order, and none
// if the leader left
const projectLeader = (enrollments?: Enrollment[]): User | undefined =>
  enrollments?.find((enrollment) => enrollment.role === ProjectRole.Leader)?.user

const Enrollments = { invitableProjects, projectLeader }
export default Enrollments
