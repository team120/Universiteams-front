'use client'
import React from 'react'
import { Alert, ActionIcon, Badge, Card, Chip, Flex, Group, Text } from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Projects, ProjectsQueryKey } from '../../../../services/projects'
import { IconHeartFilled, IconHeart } from '@tabler/icons-react'
import EnrollmentButton from '../../../../components/Enrollment/EnrollmentButton'
import Dates from '../../../../utils/string/Dates'
import { notifications } from '@mantine/notifications'
import { NotLoggedError } from '../../../../components/Account/NotLoggedError'
import { verifyEmailNotification } from '../../../../components/Account/VerifyEmailNotification'
import { CurrentUserQueryOptions } from '../../../../services/currentUser'
import { useRouter } from 'next/navigation'
import SkeletonFull from '../../../../components/Loader/SkeletonFull'

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

  const handleLeaderTagClick = (userId: number) => {
    router.push(`/projects?user=${userId}`)
  }

  if (isLoading) return <SkeletonFull />
  if (error) return <Alert color="red">{error.message}</Alert>
  if (!project) return <Alert color="red">No se encontró el proyecto</Alert>

  return (
    <>
      <Card key={project.id} mx="md" mb="0.5rem" p="md" radius="md" withBorder>
        <div style={{ width: '100%' }}>
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
                {department.facility.institution.abbreviation} | {department.facility.abbreviation}{' '}
                | {department.name}
              </Badge>
            ))}
          </Group>

          <Chip.Group>
            <Group gap={'0.5rem'} mt={'1rem'}>
              {project.enrollments && (
                <Badge
                  variant="filled"
                  color="violet.6"
                  size="lg"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleLeaderTagClick(project.enrollments[0].user.id)}>
                  {project.enrollments[0].user.firstName} {project.enrollments[0].user.lastName}, +
                  {project.userCount} personas
                </Badge>
              )}
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
        </div>
      </Card>
    </>
  )
}

export default ProjectDetailsPage
