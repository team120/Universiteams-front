import React from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { ActionIcon, Badge, Card, Group, Menu, Text, useMantineColorScheme } from '@mantine/core'
import { modals } from '@mantine/modals'
import { IconDots, IconHierarchy3, IconTrash } from '@tabler/icons-react'

import { CurrentUserQueryOptions } from '@/services/currentUser'
import Localize from 'utils/string/Localize'
import styles from './EnrollmentList.module.css'

import Enrollment, { ProjectRole } from '@/entities/Enrollment/Enrollment'
import { EnrollmentChangeRoleForm } from './EnrollmentChangeRole'
import { EnrollmentRevoke } from './EnrollmentRevoke'

interface EnrollmentListProps {
  projectId: number
  enrollments: Enrollment[]
  isAdmin: boolean
}

export const EnrollmentList: React.FC<EnrollmentListProps> = ({
  projectId,
  enrollments,
  isAdmin,
}: EnrollmentListProps) => {
  const { colorScheme } = useMantineColorScheme()
  const router = useRouter()

  const { data: currentUser } = useQuery(CurrentUserQueryOptions.currentUser())

  const handleMemberClick = (userId: number) => {
    router.push(`/users/${userId}`)
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

  const handleRevokeEnrollment = (enrollment: Enrollment) => {
    modals.open({
      title: 'Revocar inscripción',
      centered: true,
      children: <EnrollmentRevoke projectId={projectId} enrollment={enrollment} />,
    })
  }

  const handleChangeRole = (enrollment: Enrollment) => {
    modals.open({
      title: 'Cambiar rol',
      centered: true,
      children: (
        <EnrollmentChangeRoleForm
          projectId={projectId}
          currentRole={enrollment.role}
          enrollment={enrollment}
        />
      ),
    })
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
              {Localize.projectRole(enrollment.role)}
            </Badge>
          </Group>
          <Group mt="xs" gap="xs">
            {enrollment.user.userAffiliations.map((affiliation) => (
              <Badge
                key={`${enrollment.user.id}:${affiliation.researchDepartment.id}`}
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

          {isAdmin &&
            currentUser?.id !== enrollment.user.id &&
            enrollment.role !== ProjectRole.Leader && (
              <Group mt="sm" justify="flex-end">
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <ActionIcon
                      variant="transparent"
                      aria-label="Ver opciones para esta inscripción"
                      size="lg"
                      color="gray"
                      onClick={(event) => {
                        event.stopPropagation()
                      }}>
                      <IconDots />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      onClick={(event) => {
                        event.stopPropagation()
                        handleRevokeEnrollment(enrollment)
                      }}
                      leftSection={<IconTrash color="red" />}>
                      Revocar inscripción
                    </Menu.Item>
                    <Menu.Item
                      onClick={(event) => {
                        event.stopPropagation()
                        handleChangeRole(enrollment)
                      }}
                      leftSection={<IconHierarchy3 color="gray" />}>
                      Cambiar rol
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            )}
        </Card>
      ))}
    </>
  )
}
