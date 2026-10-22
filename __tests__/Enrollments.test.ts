import Enrollments from 'utils/enrollment/Enrollments'
import Enrollment, { ProjectRole } from '@/entities/Enrollment/Enrollment'
import ProjectInList from '@/entities/Project/ProjectInList'
import User from '@/entities/User/User'

const project = (id: number) => ({ id, name: `Proyecto ${id}` } as ProjectInList)

const enrollment = (projectId: number, role: ProjectRole, user = { id: 0 } as User) =>
  ({ id: projectId, role, project: project(projectId), user } as Enrollment)

const user = (id: number, enrollments: Enrollment[]) => ({ id, enrollments } as User)

describe('invitableProjects', () => {
  it('should offer the projects the current user leads or administers', () => {
    const currentUser = user(1, [
      enrollment(10, ProjectRole.Leader),
      enrollment(11, ProjectRole.Admin),
      enrollment(12, ProjectRole.Member),
    ])

    const projects = Enrollments.invitableProjects(currentUser, user(2, []))

    expect(projects.map((invitable) => invitable.id)).toEqual([10, 11])
  })

  it('should not offer projects the user is already a member of', () => {
    const currentUser = user(1, [
      enrollment(10, ProjectRole.Leader),
      enrollment(11, ProjectRole.Admin),
    ])

    const projects = Enrollments.invitableProjects(
      currentUser,
      user(2, [enrollment(11, ProjectRole.Member)])
    )

    expect(projects.map((invitable) => invitable.id)).toEqual([10])
  })

  it('should offer nothing on the current user own profile', () => {
    const currentUser = user(1, [enrollment(10, ProjectRole.Leader)])

    expect(Enrollments.invitableProjects(currentUser, currentUser)).toEqual([])
  })
})

describe('projectLeader', () => {
  it('should find the leader whatever the order of the enrollments', () => {
    const leader = { id: 5, firstName: 'Camila' } as User

    const found = Enrollments.projectLeader([
      enrollment(1, ProjectRole.Admin, { id: 6 } as User),
      enrollment(1, ProjectRole.Leader, leader),
    ])

    expect(found).toBe(leader)
  })

  it.each([[[]], [undefined]])('should return undefined when there is no leader (%p)', (list) => {
    expect(Enrollments.projectLeader(list)).toBeUndefined()
  })
})
