import React from 'react'
import { ActionIcon, Badge, Card, Chip, Flex, Group, Text } from '@mantine/core'
import Dates from 'utils/string/Dates'
import Project, { RequestState } from '@/entities/Project'
import InfoMessage from '../Common/InfoMessage/InfoMessage'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Url } from '@/services/url'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Projects } from '@/services/projects'
import {
  IconHeart,
  IconHeartFilled,
  IconSend,
  IconUserCheck,
  IconUserPlus,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { CurrentUserQueryOptions } from '../../services/currentUser'
import { modals } from '@mantine/modals'
import { EnrollmentRequestModal } from '../Enrollment/EnrollmentRequest'
import { NotLoggedError } from '../Account/NotLoggedError'

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

  const verifyEmailNotification = {
    title: 'Verifica tu correo electrónico',
    color: 'red',
  }

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
        notifications.show({
          ...verifyEmailNotification,
          message: 'Debes verificar tu correo electrónico para poder guardar proyectos',
        })

        return Promise.reject('Email not verified')
      }

      return project?.isFavorite ? Projects.unfavorite(project!.id) : Projects.favorite(project!.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })

  const cancelEnrollmentMutation = useMutation({
    mutationFn: () => Projects.cancelEnrollment(project!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      notifications.show({
        title: 'Solicitud de inscripción cancelada',
        message: 'Tu solicitud de inscripción ha sido cancelada',
      })
    },
  })

  const handleInterestTagClick = (interestId: number) => {
    Url.appendToUrl(router, pathname, searchQuery, 'interest', [interestId.toString()])
  }

  const handleFavoriteClick = () => {
    favoriteMutation.mutate()
  }

  const handleEnrollmentRequestClick = () => {
    if (errorCurrentUser || !currentUser) {
      notifications.show({
        title: 'Debes iniciar sesión para solicitar inscripciones',
        color: 'red',
        message: <NotLoggedError action="solicitar inscripciones" />,
      })

      return
    }

    if (currentUser?.isEmailVerified === false) {
      notifications.show({
        ...verifyEmailNotification,
        message: 'Debes verificar tu correo electrónico para poder solicitar inscripciones',
      })

      return
    }

    modals.open({
      title: 'Solicitar inscripción',
      centered: true,
      children: <EnrollmentRequestModal projectId={project!.id} />,
    })
  }

  const handleEnrollmentRequestCancelClick = () => {
    cancelEnrollmentMutation.mutate()
  }

  const handleEnrollmentCancelClick = () => {
    cancelEnrollmentMutation.mutate()
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

  const renderActionIcon = (requestState: RequestState | undefined | null) => {
    let icon = null
    let ariaLabel = ''
    let color = 'gray'
    let handlerFunc = () => console.log('No handler function defined')

    switch (requestState) {
      case undefined:
      case null:
        icon = <IconUserPlus />
        ariaLabel = 'Solicitar inscripción'
        handlerFunc = handleEnrollmentRequestClick
        break
      case RequestState.Pending:
        icon = <IconSend />
        color = 'blue'
        ariaLabel = 'Cancelar solicitud de inscripción'
        handlerFunc = handleEnrollmentRequestCancelClick
        break
      case RequestState.Accepted:
        icon = <IconUserCheck />
        color = 'blue'
        ariaLabel = 'Cancelar inscripción'
        handlerFunc = handleEnrollmentCancelClick
        break
      default:
        return <></>
    }

    return (
      <ActionIcon
        variant="transparent"
        aria-label={ariaLabel}
        onClick={handlerFunc}
        size="lg"
        color={color}>
        {icon}
      </ActionIcon>
    )
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
          {renderActionIcon(project.requestState)}

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
