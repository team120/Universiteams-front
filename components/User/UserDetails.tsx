import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { ActionIcon, Alert, Badge, Card, Flex, Group, Tabs, Text } from '@mantine/core'
import { useMantineColorScheme } from '@mantine/core'

import { CurrentUserQueryOptions } from '@/services/currentUser'
import { Users, UsersQueryKey } from '@/services/users'
import { IconBulb, IconFolders, IconPdf, IconSchool } from '@tabler/icons-react'

import ApiErrors from 'utils/string/ApiErrors'
import Dates from 'utils/string/Dates'
import Enrollments from 'utils/enrollment/Enrollments'
import Localize from 'utils/string/Localize'
import styles from '@/components/Enrollment/List/EnrollmentList.module.css'

import EnrollmentButtonInvitation from '@/components/Enrollment/Invitation/EnrollmentButtonInvitation'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'
import UserAffiliation from '@/entities/User/UserAffiliation'
import Interest from '@/entities/Interest'
import Enrollment from '@/entities/Enrollment/Enrollment'
import ResearchDepartment from '@/entities/ResearchDepartment'
import UserPDF from './UserPDF'

interface UserDetailsParams {
  id: number
}

export enum UserDetailsTabs {
  Projects = 'projects',
}

const UserDetails = (props: UserDetailsParams) => {
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: [UsersQueryKey, props.id],
    queryFn: () => Users.getUser(props.id),
  })

  const { data: currentUserInfo } = useQuery(CurrentUserQueryOptions.currentUser())

  // The current user's projects, to offer the ones they can invite this user to
  const currentUserId = currentUserInfo?.id
  const { data: currentUser } = useQuery({
    queryKey: [UsersQueryKey, currentUserId],
    queryFn: () => (currentUserId ? Users.getUser(currentUserId) : null),
    enabled: !!currentUserId,
    // Super admins have no public profile, so it returns 404
    retry: false,
  })

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

  if (isLoading) return <SkeletonFull />
  if (error)
    return <Alert color="red">{ApiErrors.message(error, 'No se pudo cargar el usuario')}</Alert>
  if (!user) return <Alert color="red">No se encontró el usuario</Alert>

  const invitableProjects = currentUser ? Enrollments.invitableProjects(currentUser, user) : []

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
          {currentUserInfo && invitableProjects.length > 0 && (
            <EnrollmentButtonInvitation
              currentUser={currentUserInfo}
              userId={user.id}
              userFullName={`${user.firstName} ${user.lastName}`}
              invitableProjects={invitableProjects}
            />
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
