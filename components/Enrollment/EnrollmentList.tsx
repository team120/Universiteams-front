import React from 'react'
import {
  ActionIcon,
  Badge,
  Card,
  Group,
  Menu,
  Text,
  rem,
  useMantineColorScheme,
} from '@mantine/core'
import styles from './EnrollmentList.module.css'
import Enrollment from '../../entities/Enrollment'
import { useRouter } from 'next/navigation'
import { IconDots, IconHierarchy3, IconTrash } from '@tabler/icons-react'
import { modals } from '@mantine/modals'
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

  const handleRevokeEnrollment = (enrollment: Enrollment) => {
    modals.open({
      title: 'Revocar inscripción',
      centered: true,
      children: <EnrollmentRevoke projectId={projectId} enrollment={enrollment} />,
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

          {isAdmin && (
            <Group mt="sm" justify="flex-end">
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon
                    variant="transparent"
                    aria-label="Eliminar inscripción"
                    size="lg"
                    color="gray"
                    onClick={(event) => {
                      event.stopPropagation()
                      console.log('Eliminar inscripción')
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
                    leftSection={<IconTrash color="red" width={rem(14)} height={rem(14)} />}>
                    Revocar inscripción
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconHierarchy3 color="gray" width={rem(14)} height={rem(14)} />}>
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
