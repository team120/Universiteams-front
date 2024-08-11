import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Badge, Card, Chip, Flex, Group, Loader, Tabs, Text } from '@mantine/core'

import { CurrentUserQueryOptions } from '@/services/currentUser'
import { Users } from '@/services/users'

import SkeletonFull from '@/components/Loader/SkeletonFull'
import { IconFolders, IconMail, IconSend, IconUser } from '@tabler/icons-react'
import { EnrollmentList } from '../Enrollment/EnrollmentList'
import { EnrollmentRequestShow } from '@/entities/HelpTypes/EnrollmentRequestShow'
import UserAffiliation from '@/entities/UserAffiliation'
import Interest from '@/entities/Interest'

interface UserDetailsParams {
  id: number
}

export enum UserDetailsTabs {
  Projects = 'projects',
  Requests = 'requests',
}

const UserDetails = (props: UserDetailsParams) => {
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['users', props.id],
    queryFn: () => Users.getUser(props.id),
  })

  // No mutations --- Current used not needed now
  // const { data: currentUser, error: errorCurrentUser } = useQuery(
  //   CurrentUserQueryOptions.currentUser()
  // )

  const {
    data: enrollmentRequests,
    error: errorEnrollmentRequests,
    isLoading: isLoadingEnrollmentRequests,
  } = useQuery({
    queryKey: ['enrollments', props.id],
    queryFn: () => Users.getEnrollmentRequests(props.id),
  })

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Handle methods in users endpoint
  const handleInterestTagClick = (interestId: number) => {
    router.push(`/users?interest=${interestId}`)
  }

  // Handle method in projects endpoint
  const handleDepartmentBadgeClick = (
    institutionId: number,
    facilityId: number,
    departmentId: number
  ) => {
    router.push(
      `/projects?university=${institutionId}&facility=${facilityId}&department=${departmentId}`
    )
  }

  if (isLoading) return <SkeletonFull />
  if (error) return <Alert color="red">{error.message}</Alert>
  if (!user) return <Alert color="red">No se encontró el usuario</Alert>

  return (
    <>
      <Card key={user.id} mx="md" mb="0.5rem" p="md" radius="md" withBorder>
        <Text style={{ fontSize: '3rem', fontWeight: 500, lineHeight: '3rem' }}>
          {user.firstName} {user.lastName}
        </Text>
        <Flex direction={'row'} align={'center'} gap={10} mt="0.5rem">
          <IconMail size={25} />
          <Text
            style={{
              fontSize: '1.25rem',
              fontWeight: 500,
              lineHeight: '2rem',
            }}>
            {user.email}
          </Text>
        </Flex>

        <Chip.Group>
          <Group gap={'0.5rem'} my={'1rem'}>
            {user.interests.map((interest) => (
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
        </Chip.Group>

        <Tabs
          value={searchParams.get('activeTab') ?? UserDetailsTabs.Projects}
          onChange={(value) => router.push(`${pathname}?activeTab=${value}`)}>
          <Tabs.List>
            <Tabs.Tab
              value={UserDetailsTabs.Projects}
              leftSection={<IconFolders />}
              rightSection={
                <Badge color="blue" variant="filled">
                  {/* user.enrollmentCount --- To-do: count user's active projects */}
                  99
                </Badge>
              }>
              Proyectos
            </Tabs.Tab>

            {/* !user.requestEnrollmentCount && ( --- To-do: set user's requests */}
            {true && (
              <Tabs.Tab
                value={UserDetailsTabs.Requests}
                leftSection={<IconSend />}
                rightSection={
                  <Badge color="blue" variant="filled">
                    {/* user.requestEnrollmentCount --- To-do: count user's requests */}
                    99
                  </Badge>
                }>
                Solicitudes
              </Tabs.Tab>
            )}
          </Tabs.List>

          {/*
          <Tabs.Panel value={UserDetailsTabs.Projects}>
            <EnrollmentList projectId={props.id} enrollments={user.enrollments} isAdmin={!user.requestEnrollmentCount} />
          </Tabs.Panel>
          */}

          {!errorEnrollmentRequests && enrollmentRequests && (
            <Tabs.Panel value={UserDetailsTabs.Requests}>
              {isLoadingEnrollmentRequests ? (
                <Tabs.Tab value={UserDetailsTabs.Requests}>
                  <Loader type="dots" />
                </Tabs.Tab>
              ) : (
                enrollmentRequests.enrollmentRequests.map((request: EnrollmentRequestShow) => (
                  <Card key={request.id} p="md" mt="md" withBorder>
                    <Text size="lg" w={500}>
                      {request.user.firstName} {request.user.lastName}
                    </Text>

                    <Group mt="xs" gap="xs">
                      {request.user.userAffiliations.map((affiliation: UserAffiliation) => (
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
                      {request.user.interests.map((interest: Interest) => (
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
                ))
              )}
            </Tabs.Panel>
          )}
        </Tabs>
      </Card>
    </>
  )
}

export default UserDetails
