import React from 'react'
import { ActionIcon, Center, Menu } from '@mantine/core'
import {
  IconUserPlus,
  IconSend,
  IconTrash,
  IconUserCheck,
  IconUserOff,
  IconPencil,
} from '@tabler/icons-react'
import { RequestState } from '../../entities/ProjectInList'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ProjectsQueryKey, Projects } from '../../services/projects'
import { NotLoggedError } from '../Account/NotLoggedError'
import { EnrollmentRequestCreate } from './EnrollmentRequest'
import { CurrentUserQueryOptions } from '../../services/currentUser'
import { verifyEmailNotification as verifyEmailErrorNotification } from '../Account/VerifyEmailNotification'
import { UnenrollModal } from './Unenroll'
import { EnrollmentRequestRevision } from './EnrollmentRequestRevision'

interface ActionIconComponentProps {
  projectId: number
  requestState?: RequestState | null
  requesterMessage?: string
}

const EnrollmentButton: React.FC<ActionIconComponentProps> = ({
  requestState,
  requesterMessage,
  projectId,
}) => {
  const queryClient = useQueryClient()

  const { data: currentUser, error: errorCurrentUser } = useQuery(
    CurrentUserQueryOptions.currentUser()
  )

  const cancelEnrollmentRequestMutation = useMutation({
    mutationFn: () => Projects.cancelEnrollmentRequest(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ProjectsQueryKey] })
      notifications.show({
        title: 'Solicitud de inscripción cancelada',
        message: 'Tu solicitud de inscripción ha sido cancelada',
      })
    },
  })

  const handleEnrollmentRequestClick = (event: React.MouseEvent) => {
    event.stopPropagation()

    if (errorCurrentUser || !currentUser) {
      notifications.show({
        title: 'Debes iniciar sesión para solicitar inscripciones',
        color: 'red',
        message: <NotLoggedError action="solicitar inscripciones" />,
      })

      return
    }

    if (currentUser?.isEmailVerified === false) {
      notifications.show(verifyEmailErrorNotification('solicitar inscripciones'))

      return
    }

    modals.open({
      title: 'Solicitar inscripción',
      centered: true,
      children: <EnrollmentRequestCreate projectId={projectId} />,
    })
  }

  const handleViewRequestClick = (event: React.MouseEvent) => {
    event.stopPropagation()

    modals.open({
      title: 'Solicitud de inscripción',
      centered: true,
      children: <EnrollmentRequestRevision content={requesterMessage} projectId={projectId} />,
    })
  }

  const handleEnrollmentRequestCancelClick = (event: React.MouseEvent) => {
    event.stopPropagation()

    cancelEnrollmentRequestMutation.mutate()
  }

  const handleEnrollmentRejectedClick = (event: React.MouseEvent) => {
    event.stopPropagation()

    modals.open({
      title: 'Solicitud rechazada',
      centered: true,
      children: (
        <Center>
          <p>Has sido rechazado en tu solicitud de inscripción</p>
        </Center>
      ),
    })
  }

  const handleUnenrollClick = (event: React.MouseEvent) => {
    event.stopPropagation()

    modals.open({
      title: 'Desinscribirse del proyecto',
      centered: true,
      children: <UnenrollModal projectId={projectId} />,
    })
  }

  switch (requestState) {
    case RequestState.Unenrolled:
    case undefined:
    case null:
      return (
        <ActionIcon
          variant="transparent"
          aria-label="Solicitar inscripción"
          onClick={handleEnrollmentRequestClick}
          size="lg"
          color="gray">
          <IconUserPlus />
        </ActionIcon>
      )
    case RequestState.Rejected:
      return (
        <ActionIcon
          variant="transparent"
          aria-label="Has sido rechazado"
          onClick={handleEnrollmentRejectedClick}
          size="lg"
          color="red">
          <IconUserOff />
        </ActionIcon>
      )
    case RequestState.Pending:
      return (
        <Menu position="bottom" offset={0}>
          <Menu.Target>
            <ActionIcon
              variant="transparent"
              aria-label="Opciones de solicitud"
              size="lg"
              color="blue"
              onClick={(event) => event.stopPropagation()}>
              <IconSend />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {requesterMessage && (
              <Menu.Item leftSection={<IconPencil size={14} />} onClick={handleViewRequestClick}>
                Revisar solicitud
              </Menu.Item>
            )}
            <Menu.Item
              leftSection={<IconTrash color="red" size={14} />}
              onClick={handleEnrollmentRequestCancelClick}>
              Cancelar solicitud
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )
    case RequestState.Accepted:
      return (
        <ActionIcon
          variant="transparent"
          aria-label="Cancelar inscripción"
          onClick={handleUnenrollClick}
          size="lg"
          color="blue">
          <IconUserCheck />
        </ActionIcon>
      )
    default:
      return <></>
  }
}

export default EnrollmentButton
