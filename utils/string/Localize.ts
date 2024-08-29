import { ProjectRole } from '../../entities/Enrollment/Enrollment'
import { UserAffiliationType } from '../../entities/User/UserAffiliation'

export function localizeProjectRole(role: ProjectRole) {
  switch (role) {
    case ProjectRole.Admin:
      return 'Administrador'
    case ProjectRole.Member:
      return 'Miembro'
    case ProjectRole.Leader:
      return 'Lider'
    default:
      return ''
  }
}

export function localizeAffiliationType(type: UserAffiliationType): string {
  switch (type) {
    case UserAffiliationType.Student:
      return 'Alumno'
    case UserAffiliationType.Professor:
      return 'Profesor'
    case UserAffiliationType.Researcher:
      return 'Investigador'
    case UserAffiliationType.Other:
      return 'Otro'
    default:
      return 'Desconocido'
  }
}
