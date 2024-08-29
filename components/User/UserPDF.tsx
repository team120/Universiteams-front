import React from 'react'
import { Text, StyleSheet } from '@react-pdf/renderer'

import PDF from '@/components/Common/PDF/PDF'

import Enrollment from '@/entities/Enrollment/Enrollment'
import Interest from '@/entities/Interest'
import User from '@/entities/User/User'
import UserAffiliation from '@/entities/User/UserAffiliation'
import { localizeAffiliationType, localizeProjectRole } from '../../utils/string/Localize'

const styles = StyleSheet.create({
  big: {
    fontSize: 24,
  },
  space: {
    marginTop: 16,
  },
})

interface UserPDFProps {
  user: User
}

const UserPDF = (props: UserPDFProps) => {
  const user: User = props.user

  return (
    <PDF>
      <Text style={styles.space}>Reporte de usuario:</Text>
      <Text style={styles.big}>
        {user.firstName} {user.lastName}
      </Text>
      {Array.isArray(user.interests) && user.interests.length > 0 && (
        <>
          <Text style={styles.space}>Intereses:</Text>
          {user.interests.map((interests: Interest) => (
            <Text key={interests.id}>-- {interests.name}</Text>
          ))}
        </>
      )}
      {Array.isArray(user.userAffiliations) && user.userAffiliations.length > 0 && (
        <>
          <Text style={styles.space}>Afiliaciones:</Text>
          {user.userAffiliations.map((affiliation: UserAffiliation) => (
            <Text key={affiliation.id}>
              -- {localizeAffiliationType(affiliation.currentType)}:{' '}
              {affiliation.researchDepartment.name} | {affiliation.researchDepartment.facility.name}{' '}
              | {affiliation.researchDepartment.facility.institution.name}
            </Text>
          ))}
        </>
      )}
      {Array.isArray(user.enrollments) && user.enrollments.length > 0 && (
        <>
          <Text style={styles.space}>Projectos donde participa:</Text>
          {user.enrollments.map((enrollment: Enrollment) => (
            <Text key={enrollment.id}>
              -- {localizeProjectRole(enrollment.role)}: {enrollment.project.name}
            </Text>
          ))}
        </>
      )}
    </PDF>
  )
}

export default UserPDF
