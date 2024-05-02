import React from 'react'
import { ActionIcon, Badge, Card, Chip, Flex, Group, Text } from '@mantine/core'
import Dates from 'utils/string/Dates'
import Project from '@/entities/Project'
import InfoMessage from '../Common/InfoMessage/InfoMessage'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Url } from '@/services/url'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Projects, ProjectsQueryKey } from '@/services/projects'
import { IconHeart, IconHeartFilled } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { CurrentUserQueryOptions } from '../../services/currentUser'
import { NotLoggedError } from '../Account/NotLoggedError'
import EnrollmentButton from '../Enrollment/EnrollmentButton'
import { verifyEmailNotification } from '../Account/VerifyEmailNotification'

interface ProjectItemProps {
  project?: Project
}

const ProjectItem = (props: ProjectItemProps) => {
  const project = props.project

  const searchQuery = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
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

  const handleInterestTagClick = (interestId: number) => {
    Url.appendToUrl(router, pathname, searchQuery, 'interest', [interestId.toString()])
  }

  const handleFavoriteClick = () => {
    favoriteMutation.mutate()
  }

  const handleDepartmentBadgeClick = (
    institutionId: number,
    facilityId: number,
    departmentId: number
  ) => {
    let modifiedSearchQuery = searchQuery
    modifiedSearchQuery = Url.setUrlParam(
      router,
      pathname,
      searchQuery,
      'university',
      institutionId.toString()
    )
    modifiedSearchQuery = Url.setUrlParam(
      router,
      pathname,
      modifiedSearchQuery,
      'facility',
      facilityId.toString()
    )
    Url.setUrlParam(router, pathname, modifiedSearchQuery, 'department', departmentId.toString())
  }

  const handleLeaderTagClick = (userId: number) => {
    Url.setUrlParam(router, pathname, searchQuery, 'user', userId.toString())
  }

  // Small loader needed?
  if (!project) return <InfoMessage text="No se ha podido cargar el projecto" type="error" />

  return (
    <Card
      key={project.id}
      mx="md"
      mb="0.5rem"
      p="md"
      radius="md"
      style={{
        display: 'flex',
        flexDirection: 'row',
        borderStyle: 'solid',
        borderColor: 'gray',
      }}>
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
              {department.facility.institution.abbreviation} | {department.facility.abbreviation} |{' '}
              {department.name}
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
  )
}

export default ProjectItem
