import React, { useState } from 'react'
import { ActionIcon, Badge, Card, Chip, Flex, Group, Text, useMantineTheme } from '@mantine/core'
import Dates from 'utils/string/Dates'
import Project, { RequestState } from '@/entities/Project'
import InfoMessage from '../Common/InfoMessage/InfoMessage'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Url } from '@/services/url'
import { Projects } from '@/services/projects'
import {
  IconHeart,
  IconHeartFilled,
  IconSend,
  IconUserCheck,
  IconUserPlus,
} from '@tabler/icons-react'
import Theme from '../../src/app/theme'
import { notifications } from '@mantine/notifications'

interface ProjectItemProps {
  project?: Project
}

const ProjectItem = (props: ProjectItemProps) => {
  const theme = useMantineTheme()
  const project = props.project

  const [isFavorite, setIsFavorite] = useState(project?.isFavorite)
  const [favoriteCount, setFavoriteCount] = useState(project?.favoriteCount)

  const [requestState, setRequestState] = useState(
    project?.requestState == null ? undefined : project.requestState
  )

  const searchQuery = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const handleInterestTagClick = (interestId: number) => {
    Url.appendToUrl(router, pathname, searchQuery, 'interest', [interestId.toString()])
  }

  const handleFavoriteClick = async (projectId: number) => {
    if (isFavorite) {
      const result = await Projects.unfavorite(projectId)
      if (result) {
        setIsFavorite(false)
        favoriteCount !== undefined && setFavoriteCount(favoriteCount - 1)
      }
    } else {
      const result = await Projects.favorite(projectId)
      if (result) {
        setIsFavorite(true)
        favoriteCount !== undefined && setFavoriteCount(favoriteCount + 1)
      }
    }
  }

  const handleEnrollmentRequestClick = async (projectId: number) => {
    try {
      await Projects.requestEnrollment(projectId)
      setRequestState(RequestState.Pending)
      notifications.show({
        title: 'Solicitud de inscripcion enviada',
        message: 'Espera a que el líder del proyecto acepte tu solicitud',
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleEnrollmentRequestCancelClick = async (projectId: number) => {
    try {
      await Projects.cancelEnrollment(projectId)
      setRequestState(undefined)
      notifications.show({
        title: 'Solicitud de inscripcion cancelada',
        message: 'Tu solicitud de inscripción ha sido cancelada',
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleEnrollmentCancelClick = async (projectId: number) => {
    try {
      await Projects.cancelEnrollment(projectId)
      setRequestState(undefined)
      notifications.show({
        title: 'Inscripción cancelada',
        message: 'Tu inscripción en el proyecto ha sido cancelada',
      })
    } catch (error) {
      console.error(error)
    }
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
    modifiedSearchQuery = Url.setUrlParam(
      router,
      pathname,
      modifiedSearchQuery,
      'department',
      departmentId.toString()
    )
  }

  const handleLeaderTagClick = (userId: number) => {
    Url.setUrlParam(router, pathname, searchQuery, 'user', userId.toString())
  }

  const renderActionIcon = (requestState: RequestState | undefined, projectId: number) => {
    let icon = null
    let ariaLabel = ''
    let color = 'gray'
    let handlerFunc = (_: number) => console.log('No handler function defined')

    switch (requestState) {
      case undefined:
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
        onClick={() => handlerFunc(projectId)}
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
      mx={'3%'}
      mb={'0.5rem'}
      p='lg'
      radius="md"
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '94%',
        borderStyle: 'solid',
        borderColor: 'gray',
      }}>
      <div style={{ width: '100%' }}>
        <Card.Section>
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
                color={Theme.colors?.pink?.[6]}
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
        </Card.Section>

        <Chip.Group>
          <Group gap={'0.5rem'} mt={'1rem'}>
            {project.enrollments && (
              <Badge
                variant="filled"
                color={Theme.colors?.violet?.[6]}
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
                color={Theme.colors?.blue?.[6]}
                size="lg"
                style={{ cursor: 'pointer' }}
                onClick={() => handleInterestTagClick(interest.id)}>
                {interest.name}
              </Badge>
            ))}
          </Group>
        </Chip.Group>

        <Flex justify="flex-end" align="center">
          {renderActionIcon(requestState, project.id)}

          <ActionIcon
            variant="transparent"
            aria-label="Guardar en marcadores"
            onClick={() => handleFavoriteClick(project.id)}
            size="lg"
            color={isFavorite ? 'blue' : 'gray'}>
            {isFavorite ? <IconHeartFilled /> : <IconHeart />}
          </ActionIcon>
          <Text size="sm">{favoriteCount}</Text>
        </Flex>
      </div>
    </Card>
  )
}

export default ProjectItem
