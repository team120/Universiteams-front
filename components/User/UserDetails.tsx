import React, { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { ActionIcon, Alert, Badge, Card, Flex, Group, Tabs, Text } from '@mantine/core'
import { useMantineColorScheme } from '@mantine/core'

import { CurrentUserQueryOptions } from '@/services/currentUser'
import { Users } from '@/services/users'
import { IconBulb, IconFolders, IconPdf, IconSchool } from '@tabler/icons-react'

import Dates from 'utils/string/Dates'
import Localize from 'utils/string/Localize'
import styles from '@/components/Enrollment/List/EnrollmentList.module.css'

import Enrollment, { ProjectRole } from '@/entities/Enrollment/Enrollment'
import EnrollmentButtonInvitation from '@/components/Enrollment/Invitation/EnrollmentButtonInvitation'
import Interest from '@/entities/Interest'
import Project from '@/entities/Project/Project'
import ResearchDepartment from '@/entities/ResearchDepartment'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'
import UserAffiliation from '@/entities/User/UserAffiliation'
import UserPDF from './UserPDF'
import ProjectInList from '@/entities/Project/ProjectInList'

interface UserDetailsParams {
  id: number
}

export enum UserDetailsTabs {
  Projects = 'projects',
}

const UserDetails = (props: UserDetailsParams) => {
  const {
    data: user,
    error: errorUser,
    isLoading: isLoadingUser,
  } = useQuery({
    queryKey: ['users', props.id],
    queryFn: () => Users.getUser(props.id),
  })

  const { data: currentUserInfo } = useQuery(CurrentUserQueryOptions.currentUser())

  const {
    data: currentUser,
    error: errorCurrentUser,
    isLoading: isLoadingCurrentUser,
  } = useQuery({
    queryKey: ['currentUser', currentUserInfo?.id],
    queryFn: () => Users.getUser(currentUserInfo?.id as number),
  })

  const [possibleProjects, setPossibleProjects] = useState<ProjectInList[]>([])

  useEffect(() => {
    if (!currentUser) return
    if (!user) return

    // Admin of at least one project
    const currentUserAdminProjects: ProjectInList[] = currentUser.enrollments
      .filter(
        (enrollment: Enrollment) =>
          enrollment.role === ProjectRole.Admin || enrollment.role === ProjectRole.Leader
      )
      .map((enrollment: Enrollment) => enrollment.project)

    if (currentUserAdminProjects.length === 0) {
      setPossibleProjects([])
      return
    }

    // Projects in which the user is enrolled
    const selectedUserEnrolledProjects: number[] = user.enrollments.map(
      (enrollment: Enrollment) => enrollment.project.id
    )

    if (selectedUserEnrolledProjects.length === 0) {
      setPossibleProjects(currentUserAdminProjects)
      return
    }

    // Projects in which the user is not enrolled and the current user is admin
    const filteredProjects: ProjectInList[] = currentUserAdminProjects.filter(
      (project: ProjectInList) => !selectedUserEnrolledProjects.includes(project.id)
    )

    setPossibleProjects(filteredProjects)
  }, [currentUser, user])

  const { colorScheme } = useMantineColorScheme()

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Handle methods in users endpoint
  const handleInterestTagClick = (interestId: number) => {
    router.push(`/users?interest=${interestId}`)
  }

  const handleDepartmentBadgeClick = (
    institutionId: number,
    facilityId: number,
    departmentId: number
  ) => {
    router.push(
      `/users?university=${institutionId}&facility=${facilityId}&department=${departmentId}`
    )
  }

  // Handle method in projects endpoint
  const handleProjectClick = (projectId: number) => {
    router.push(`/projects/${projectId}`)
  }

  if (isLoadingUser || isLoadingCurrentUser) return <SkeletonFull />
  if (errorUser) return <Alert color="red">{errorUser.message}</Alert>
  if (errorCurrentUser) return <Alert color="red">{errorCurrentUser.message}</Alert>
  if (!user) return <Alert color="red">No se encontró el usuario</Alert>
  if (!currentUser) return <Alert color="red">No se ha cargado el usuario actual</Alert>

  return (
    <>
      <Card key={user.id} mx="md" mb="0.5rem" p="md" radius="md" withBorder>
        <Text style={{ fontSize: '3rem', fontWeight: 500, lineHeight: '3rem' }}>
          {user.firstName} {user.lastName}
        </Text>
        {Array.isArray(user.userAffiliations) && user.userAffiliations.length > 0 && (
          <Group mt={'1rem'}>
            <IconSchool size={25} />
            <Flex direction={'row'} gap={'0.5rem'} mt={'0.5rem'}>
              {user.userAffiliations.map((affiliation: UserAffiliation) => (
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
            </Flex>
          </Group>
        )}
        {Array.isArray(user.interests) && user.interests.length > 0 && (
          <Group mt={'1rem'}>
            <IconBulb size={25} />
            <Group gap={'0.5rem'} mt={'0.5rem'}>
              {user.interests.map((interest: Interest) => (
                <Badge
                  variant="dot"
                  key={interest.id}
                  color="blue.6"
                  size="lg"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleInterestTagClick(interest.id)}>
                  {interest.name}
                </Badge>
              ))}
            </Group>
          </Group>
        )}
        <Flex justify="flex-end" align="center" gap={'1rem'}>
          {possibleProjects.length > 0 && (
            <>
              <EnrollmentButtonInvitation userId={user.id} possibleProjects={possibleProjects} />
            </>
          )}
          <PDFDownloadLink
            document={<UserPDF user={user} />}
            fileName={`user_document_${Dates.getDateTimeShort()}.pdf`}>
            {() => (
              <ActionIcon variant="transparent" aria-label="Exportar a PDF" size="lg" color="blue">
                <IconPdf />
              </ActionIcon>
            )}
          </PDFDownloadLink>
        </Flex>
        <Tabs
          mt={'2rem'}
          value={searchParams.get('activeTab') ?? UserDetailsTabs.Projects}
          onChange={(value) => router.push(`${pathname}?activeTab=${value}`)}>
          <Tabs.List>
            <Tabs.Tab
              value={UserDetailsTabs.Projects}
              leftSection={<IconFolders />}
              rightSection={
                <Badge color="blue" variant="filled">
                  {Array.isArray(user.enrollments) ? user.enrollments.length : 0}
                </Badge>
              }>
              Proyectos
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={UserDetailsTabs.Projects}>
            {Array.isArray(user.enrollments) &&
              user.enrollments.map((enrollment: Enrollment) => (
                <Card
                  key={enrollment.id}
                  p="md"
                  mt="md"
                  withBorder
                  className={`${styles.memberCard} ${
                    colorScheme == 'dark' ? styles.memberCardDark : styles.memberCardLight
                  }`}
                  onClick={() => handleProjectClick(enrollment.project.id)}>
                  <Text style={{ fontSize: '1.25rem', fontWeight: 500, lineHeight: '1.75rem' }}>
                    {enrollment.project.name}
                  </Text>
                  <Group justify="space-between" gap="xs">
                    <Group gap={'1rem'} style={{ marginBottom: 'xs' }}>
                      <Text style={{ fontWeight: 500 }}>
                        {enrollment.project.type} |{' '}
                        {Dates.formatDate(enrollment.project.creationDate)}
                        {enrollment.project.endDate
                          ? ` - ${Dates.formatDate(enrollment.project.endDate)}`
                          : ''}
                      </Text>
                      {Array.isArray(enrollment.project.researchDepartments) &&
                        enrollment.project.researchDepartments.map(
                          (department: ResearchDepartment) => (
                            <Badge
                              key={department.id}
                              color="pink.6"
                              variant="light"
                              component="button"
                              style={{ cursor: 'pointer' }}
                              onClick={() =>
                                handleDepartmentBadgeClick(
                                  department.facility.institution.id,
                                  department.facility.id,
                                  department.id
                                )
                              }>
                              {department.facility.institution.abbreviation} |{' '}
                              {department.facility.abbreviation} | {department.name}
                            </Badge>
                          )
                        )}
                    </Group>
                    <Badge variant="outline" color="blue.6" size="sm" radius="xs">
                      {Localize.projectRole(enrollment.role)}
                    </Badge>
                  </Group>
                </Card>
              ))}
          </Tabs.Panel>
        </Tabs>
      </Card>
    </>
  )
}

export default UserDetails
