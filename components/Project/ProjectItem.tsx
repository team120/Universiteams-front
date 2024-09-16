import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ActionIcon, Badge, Card, Group, Text, useMantineColorScheme } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import Dates from 'utils/string/Dates'
import { IconBell, IconHeart, IconHeartFilled } from '@tabler/icons-react'
import styles from './ProjectItem.module.css'

import { CurrentUserQueryOptions } from '@/services/currentUser'
import { Projects, ProjectsQueryKey } from '@/services/projects'
import { Url } from '@/services/url'

import EnrollmentButtonRequest from '@/components/Enrollment/Request/EnrollmentButtonRequest'
import InfoMessage from '@/components/Common/InfoMessage/InfoMessage'
import { NotLoggedError } from '@/components/Account/NotLoggedError'
import { ProjectDetailsTabs } from './ProjectDetails'
import ProjectInList from '@/entities/Project/ProjectInList'
import { verifyEmailNotification } from '@/components/Account/VerifyEmailNotification'

interface ProjectItemProps {
  project?: ProjectInList
}

const ProjectItem = (props: ProjectItemProps) => {
  const project = props.project

  const searchQuery = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const { colorScheme } = useMantineColorScheme()

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

  const handleInterestTagClick = (interestId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    Url.appendToUrl(router, pathname, searchQuery, 'interest', [interestId.toString()])
  }

  const handleFavoriteClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    favoriteMutation.mutate()
  }

  const handleDepartmentBadgeClick = (
    institutionId: number,
    facilityId: number,
    departmentId: number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation()
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

  const handleLeaderTagClick = (userId: number, event: React.MouseEvent) => {
    event.stopPropagation()
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
      onClick={() => router.push(`/projects/${project.id}`)}
      className={`${styles.card} ${colorScheme == 'dark' ? styles.cardDark : styles.cardLight}`}>
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
              onClick={(event) =>
                handleDepartmentBadgeClick(
                  department.facility.institution.id,
                  department.facility.id,
                  department.id,
                  event
                )
              }>
              {department.facility.institution.abbreviation} | {department.facility.abbreviation} |{' '}
              {department.name}
            </Badge>
          ))}
        </Group>

        <Group gap={'0.5rem'} mt={'1rem'}>
          {project.enrollments && (
            <Badge
              variant="filled"
              color="violet.6"
              size="lg"
              style={{ cursor: 'pointer' }}
              onClick={(event) => handleLeaderTagClick(project.enrollments[0].user.id, event)}>
              {project.enrollments[0].user.firstName} {project.enrollments[0].user.lastName}
              {project.userCount > 1 ? `, +${project.userCount - 1} personas` : ''}
            </Badge>
          )}
          {project.interests.map((interest) => (
            <Badge
              variant="dot"
              key={interest.id}
              color="blue.6"
              size="lg"
              style={{ cursor: 'pointer' }}
              onClick={(event) => handleInterestTagClick(interest.id, event)}>
              {interest.name}
            </Badge>
          ))}
        </Group>

        <Group justify="flex-end" align="center" gap="xs">
          {project.requestEnrollmentCount != null && project.requestEnrollmentCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ActionIcon
                variant="transparent"
                aria-label="Solicitudes de inscripción"
                onClick={(event) => {
                  event.stopPropagation()
                  router.push(`/projects/${project.id}?activeTab=${ProjectDetailsTabs.Requests}`)
                }}
                size="lg"
                color="blue">
                <IconBell />
              </ActionIcon>
              <Text size="sm">{project.requestEnrollmentCount}</Text>
            </div>
          )}

          <EnrollmentButtonRequest
            projectId={project.id}
            requestState={project.requestState}
            requesterMessage={project.requesterMessage}
            adminMessage={project.adminMessage}
          />

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ActionIcon
              variant="transparent"
              aria-label="Guardar en marcadores"
              onClick={(event) => handleFavoriteClick(event)}
              size="lg"
              color={project.isFavorite ? 'blue' : 'gray'}>
              {project.isFavorite ? <IconHeartFilled /> : <IconHeart />}
            </ActionIcon>
            <Text size="sm">{project.favoriteCount}</Text>
          </div>
        </Group>
      </div>
    </Card>
  )
}

export default ProjectItem
