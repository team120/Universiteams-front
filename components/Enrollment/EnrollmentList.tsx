import React from 'react'
import { Badge, Card, Group, Text, useMantineColorScheme } from '@mantine/core'
import styles from './EnrollmentList.module.css'
import Enrollment from '../../entities/Enrollment'
import { useRouter } from 'next/navigation'

interface EnrollmentListProps {
  enrollments: Enrollment[]
}

export const EnrollmentList: React.FC<EnrollmentListProps> = ({
  enrollments,
}: EnrollmentListProps) => {
  const { colorScheme } = useMantineColorScheme()
  const router = useRouter()

  const handleMemberClick = (userId: number) => {
    router.push(`/projects?user=${userId}`)
  }

  const handleDepartmentBadgeClick = (
    institutionId: number,
    facilityId: number,
    departmentId: number
  ) => {
    router.push(
      `/projects?university=${institutionId}&facility=${facilityId}&department=${departmentId}`
    )
  }

  const handleInterestTagClick = (interestId: number) => {
    router.push(`/projects?interest=${interestId}`)
  }

  return (
    <>
      {enrollments.map((enrollment) => (
        <Card
          key={enrollment.id}
          p="md"
          mt="md"
          withBorder
          className={`${styles.memberCard} ${
            colorScheme == 'dark' ? styles.memberCardDark : styles.memberCardLight
          }`}
          onClick={() => handleMemberClick(enrollment.user.id)}>
          <Group justify="space-between" gap="xs">
            <Text size="lg" w={500}>
              {enrollment.user.firstName} {enrollment.user.lastName}
            </Text>
            <Badge variant="outline" color="blue.6" size="sm" radius="xs">
              {enrollment.role}
            </Badge>
          </Group>
          <Group mt="xs" gap="xs">
            {enrollment.user.userAffiliations.map((affiliation) => (
              <Badge
                key={affiliation.id}
                color="pink.6"
                variant="light"
                component="button"
                style={{ cursor: 'pointer' }}
                onClick={(event) => {
                  event.stopPropagation()
                  handleDepartmentBadgeClick(
                    affiliation.researchDepartment.facility.institution.id,
                    affiliation.researchDepartment.facility.id,
                    affiliation.researchDepartment.id
                  )
                }}>
                {affiliation.researchDepartment.facility.institution.abbreviation} |{' '}
                {affiliation.researchDepartment.facility.abbreviation} |{' '}
                {affiliation.researchDepartment.name}
              </Badge>
            ))}
          </Group>

          <Group mt="xs" gap="xs">
            {enrollment.user.interests.map((interest) => (
              <Badge
                variant="dot"
                key={interest.id}
                color="blue.6"
                size="lg"
                style={{ cursor: 'pointer' }}
                onClick={(event) => {
                  event.stopPropagation()
                  handleInterestTagClick(interest.id)
                }}>
                {interest.name}
              </Badge>
            ))}
          </Group>
        </Card>
      ))}
    </>
  )
}
