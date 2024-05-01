import React from 'react'
import { ActionIcon, Popover, Center } from '@mantine/core'
import { IconUserPlus, IconSend, IconTrash, IconUserCheck } from '@tabler/icons-react'
import { RequestState } from '../../entities/Project'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Projects } from '../../services/projects'
import { NotLoggedError } from '../Account/NotLoggedError'
import { EnrollmentRequestModal } from './EnrollmentRequest'
import { CurrentUserQueryOptions } from '../../services/currentUser'
import { verifyEmailNotification as verifyEmailErrorNotification } from '../Account/VerifyEmailNotification'

interface ActionIconComponentProps {
  projectId: number
  requestState?: RequestState | null
}

const EnrollmentButton: React.FC<ActionIconComponentProps> = ({ requestState, projectId }) => {
  const queryClient = useQueryClient()

  const { data: currentUser, error: errorCurrentUser } = useQuery(
    CurrentUserQueryOptions.currentUser()
  )

  const cancelEnrollmentMutation = useMutation({
    mutationFn: () => Projects.cancelEnrollment(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      notifications.show({
        title: 'Solicitud de inscripción cancelada',
        message: 'Tu solicitud de inscripción ha sido cancelada',
      })
    },
  })

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
      notifications.show(verifyEmailErrorNotification('solicitar inscripciones'))

      return
    }

    modals.open({
      title: 'Solicitar inscripción',
      centered: true,
      children: <EnrollmentRequestModal projectId={projectId} />,
    })
  }

  const handleEnrollmentRequestCancelClick = () => {
    cancelEnrollmentMutation.mutate()
  }

  const handleEnrollmentCancelClick = () => {
    cancelEnrollmentMutation.mutate()
  }

  switch (requestState) {
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
    case 'Pending':
      return (
        <Popover position="bottom" offset={0}>
          <Popover.Target>
            <ActionIcon
              variant="transparent"
              aria-label="Cancelar solicitud de inscripción"
              size="lg"
              color="blue">
              <IconSend />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <Center style={{ cursor: 'pointer' }} onClick={handleEnrollmentRequestCancelClick}>
              <IconTrash /> Cancelar solicitud
            </Center>
          </Popover.Dropdown>
        </Popover>
      )
    case 'Accepted':
      return (
        <ActionIcon
          variant="transparent"
          aria-label="Cancelar inscripción"
          onClick={handleEnrollmentCancelClick}
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
