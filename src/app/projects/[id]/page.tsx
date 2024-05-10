'use client'
import React, { useMemo } from 'react'
import { Alert, ActionIcon, Badge, Card, Chip, Flex, Group, Text, Accordion } from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Projects, ProjectsQueryKey } from '../../../../services/projects'
import { IconHeartFilled, IconHeart, IconUsersGroup, IconSend } from '@tabler/icons-react'
import EnrollmentButton from '../../../../components/Enrollment/EnrollmentButton'
import Dates from '../../../../utils/string/Dates'
import { notifications } from '@mantine/notifications'
import { NotLoggedError } from '../../../../components/Account/NotLoggedError'
import { verifyEmailNotification } from '../../../../components/Account/VerifyEmailNotification'
import { CurrentUserQueryOptions } from '../../../../services/currentUser'
import { useRouter } from 'next/navigation'
import SkeletonFull from '../../../../components/Loader/SkeletonFull'
import sanitizeHtml from 'sanitize-html'

interface ProjectDetailsParams {
  params: { id: number }
}

const ProjectDetailsPage = ({ params }: ProjectDetailsParams) => {
  const {
    data: project,
    error,
    isLoading,
  } = useQuery({
    queryKey: [ProjectsQueryKey, params.id],
    queryFn: () => Projects.getProject(params.id),
  })

  const sanitizedDescription = useMemo(
    () => sanitizeHtml(project?.description ?? ''),
    [project?.description]
  )

  const queryClient = useQueryClient()

  const { data: currentUser, error: errorCurrentUser } = useQuery(
    CurrentUserQueryOptions.currentUser()
  )

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (errorCurrentUser || !currentUser) {
        notifications.show({
          title: 'Debes iniciar sesión para guardar proyectos',
          color: 'red',
          message: <NotLoggedError action="guardar proyectos" />,
        })

        return Promise.reject('User not logged in')
      }

      if (currentUser?.isEmailVerified === false) {
        notifications.show(verifyEmailNotification('guardar proyectos'))

        return Promise.reject('Email not verified')
      }

      return project?.isFavorite ? Projects.unfavorite(project!.id) : Projects.favorite(project!.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ProjectsQueryKey] })
    },
  })

  const handleFavoriteClick = () => {
    favoriteMutation.mutate()
  }

  const router = useRouter()

  const handleInterestTagClick = (interestId: number) => {
    router.push(`/projects?interest=${interestId}`)
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

  const handleMemberClick = (userId: number) => {
    router.push(`/projects?user=${userId}`)
  }

  if (isLoading) return <SkeletonFull />
  if (error) return <Alert color="red">{error.message}</Alert>
  if (!project) return <Alert color="red">No se encontró el proyecto</Alert>

  return (
    <>
      <Card key={project.id} mx="md" mb="0.5rem" p="md" radius="md" withBorder>
        <Text style={{ fontSize: '1.25rem', fontWeight: 500, lineHeight: '1.75rem' }}>
          {project.name}
        </Text>
        <Group gap={'1rem'} style={{ marginBottom: 'xs' }}>
          <Text style={{ fontWeight: 500 }}>
            {project.type} | {Dates.formatDate(project.creationDate)}
            {project.endDate ? ` - ${Dates.formatDate(project.endDate)}` : ''}
          </Text>
          {project.researchDepartments.map((department) => (
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
              {department.facility.institution.abbreviation} | {department.facility.abbreviation} |{' '}
              {department.name}
            </Badge>
          ))}
        </Group>

        <Chip.Group>
          <Group gap={'0.5rem'} mt={'1rem'}>
            {project.interests.map((interest) => (
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

        <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />

        <Flex justify="flex-end" align="center">
          <EnrollmentButton
            projectId={project.id}
            requestState={project.requestState}
            requesterMessage={project.requesterMessage}
          />

          <ActionIcon
            variant="transparent"
            aria-label="Guardar en marcadores"
            onClick={handleFavoriteClick}
            size="lg"
            color={project.isFavorite ? 'blue' : 'gray'}>
            {project.isFavorite ? <IconHeartFilled /> : <IconHeart />}
          </ActionIcon>
          <Text size="sm">{project.favoriteCount}</Text>
        </Flex>

        <Accordion defaultValue="Apples">
          <Accordion.Item key="members" value="members">
            <Accordion.Control icon={<IconUsersGroup />}>Miembros</Accordion.Control>
            <Accordion.Panel>
              {project.enrollments.map((enrollment) => (
                <Card
                  key={enrollment.id}
                  p="md"
                  mt="md"
                  withBorder
                  style={{ cursor: 'pointer' }}
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
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item key="requests" value="requests">
            <Accordion.Control icon={<IconSend />}>Solicitudes</Accordion.Control>
            <Accordion.Panel>
              <Text>100 Solicitudes</Text>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Card>
    </>
  )
}

export default ProjectDetailsPage
