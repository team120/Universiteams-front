import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ActionIcon, Menu } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'

import {
  IconUserPlus,
  IconSend,
  IconTrash,
  IconUserCheck,
  IconUserOff,
  IconPencil,
  IconEye,
} from '@tabler/icons-react'
import { CurrentUserQueryOptions } from '@/services/currentUser'
import { ProjectsQueryKey } from '@/services/projects'
import { Users } from '@/services/users'
import sanitize from 'sanitize-html'

import { EnrollmentInvitationCancel } from './EnrollmentInvitationCancel'
import { EnrollmentInvitationCreate } from './EnrollmentInvitationCreate'
import { EnrollmentInvitationUpdate } from './EnrollmentInvitationUpdate'
import { NotLoggedError } from '@/components/Account/NotLoggedError'
import ProjectInList, { RequestState } from '@/entities/Project/ProjectInList'
import { verifyEmailNotification } from '@/components/Account/VerifyEmailNotification'

interface EnrollmentButtonInvitationProps {
  userId: number
  possibleProjects?: ProjectInList[]
  projectId?: number
  requestState?: RequestState | null
  requesterMessage?: string
  adminMessage?: string
}

const EnrollmentButtonInvitation: React.FC<EnrollmentButtonInvitationProps> = (
  props: EnrollmentButtonInvitationProps
) => {
  const queryClient = useQueryClient()

  const { data: currentUser, error: errorCurrentUser } = useQuery(
    CurrentUserQueryOptions.currentUser()
  )

  const cancelEnrollmentInvitationMutation = useMutation({
    mutationFn: () => Users.cancelEnrollInvitation(props.userId, props.projectId as number),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ProjectsQueryKey] })
      notifications.show({
        title: 'Invitación de inscripción cancelada',
        message: 'La invitación de inscripción ha sido cancelada',
      })
    },
  })

  const handleEnrollmentInvitationClick = (event: React.MouseEvent) => {
    event.stopPropagation()

    if (errorCurrentUser || !currentUser) {
      notifications.show({
        title: 'Debes iniciar sesión para realizar invitaciones de inscripción',
        color: 'red',
        message: <NotLoggedError action="realizar invitaciones de inscripción" />,
      })

      return
    }

    if (currentUser?.isEmailVerified === false) {
      notifications.show(verifyEmailNotification('realizar invitaciones de inscripción'))

      return
    }

    modals.open({
      title: 'Invitación de inscripción',
      centered: true,
      children: (
        <EnrollmentInvitationCreate
          userId={props.userId}
          possibleProjects={props.possibleProjects}
        />
      ),
    })
  }

  const handleReviewRequestClick = (event: React.MouseEvent) => {
    event.stopPropagation()

    modals.open({
      title: 'Invitación de inscripción',
      centered: true,
      children: (
        <EnrollmentInvitationUpdate
          content={props.requesterMessage}
          userId={props.userId}
          projectId={props.projectId as number}
        />
      ),
    })
  }

  const handleReviewUserMessageClick = (event: React.MouseEvent) => {
    event.stopPropagation()

    modals.open({
      title: 'Mensaje del usuario',
      centered: true,
      children: <div dangerouslySetInnerHTML={{ __html: sanitize(props.adminMessage ?? '') }} />,
    })
  }

  const handleEnrollmentInvitationCancelClick = (event: React.MouseEvent) => {
    event.stopPropagation()

    cancelEnrollmentInvitationMutation.mutate()
  }

  const handleEnrollmentDeclinedClick = (event: React.MouseEvent) => {
    event.stopPropagation()

    modals.open({
      title: 'Invitación declinada',
      centered: true,
      children: (
        <EnrollmentInvitationCancel
          userId={props.userId}
          projectId={props.projectId as number}
          adminMessage={props.adminMessage}
          requesterMessage={props.requesterMessage}
        />
      ),
    })
  }

  switch (props.requestState) {
    case RequestState.Unenrolled:
    case RequestState.Rejected:
    case RequestState.Kicked:
    case undefined:
    case null:
      return (
        <ActionIcon
          variant="transparent"
          aria-label="Realizar invitación de inscripción"
          onClick={handleEnrollmentInvitationClick}
          size="lg"
          color="gray">
          <IconUserPlus />
        </ActionIcon>
      )
    case RequestState.Declined:
      return (
        <ActionIcon
          variant="transparent"
          aria-label="La invitación ha sido declinada"
          onClick={handleEnrollmentDeclinedClick}
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
            {props.requesterMessage && (
              <Menu.Item leftSection={<IconPencil size={14} />} onClick={handleReviewRequestClick}>
                Revisar invitación
              </Menu.Item>
            )}
            <Menu.Item
              leftSection={<IconTrash color="red" size={14} />}
              onClick={handleEnrollmentInvitationCancelClick}>
              Cancelar solicitud
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )
    case RequestState.Accepted:
      return (
        <Menu position="bottom" offset={0}>
          <Menu.Target>
            <ActionIcon
              variant="transparent"
              aria-label="Ver opciones de invitación"
              size="lg"
              color="blue"
              onClick={(event) => event.stopPropagation()}>
              <IconUserCheck />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {props.adminMessage && (
              <Menu.Item leftSection={<IconEye size={14} />} onClick={handleReviewUserMessageClick}>
                Ver mensaje del usuario
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      )
    default:
      return <></>
  }
}

export default EnrollmentButtonInvitation
