import React from 'react'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ActionIcon, Alert, Anchor, Badge, Card, Group, Loader, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { IconBubbleText, IconEdit, IconTrash } from '@tabler/icons-react'

import { EnrollmentInvitationsQueryKey, Projects } from '@/services/projects'
import sanitizeHtml from 'sanitize-html'
import ApiErrors from 'utils/string/ApiErrors'
import Dates from 'utils/string/Dates'

import { EnrollmentInvitationShow } from '@/entities/Enrollment/EnrollmentInvitationShow'
import { RequestState } from '@/entities/Project/ProjectInList'
import { EnrollmentInvitationUpdate } from './EnrollmentInvitationUpdate'

interface EnrollmentInvitationListProps {
  projectId: number
}

// Pending and declined invitations of a project, for its admins and leaders
export const EnrollmentInvitationList = (
  props: EnrollmentInvitationListProps
): React.JSX.Element => {
  const queryClient = useQueryClient()

  const invitationsQuery = useQuery({
    queryKey: [EnrollmentInvitationsQueryKey, props.projectId],
    queryFn: () => Projects.getEnrollmentInvitations(props.projectId),
  })

  const cancelInvitationMutation = useMutation({
    mutationFn: (userId: number) => Projects.cancelEnrollmentInvitation(props.projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [EnrollmentInvitationsQueryKey, props.projectId],
      })
      notifications.show({
        title: 'Invitación de inscripción eliminada',
        message: 'La invitación de inscripción ha sido eliminada correctamente',
      })
    },
    onError: (error) => {
      console.error('Enrollment invitation cancel failed:', error)
      queryClient.invalidateQueries({
        queryKey: [EnrollmentInvitationsQueryKey, props.projectId],
      })
      notifications.show({
        title: 'Error al eliminar la invitación de inscripción',
        message: ApiErrors.message(error, 'Por favor, inténtalo de nuevo más tarde'),
        color: 'red',
      })
    },
  })

  const userFullName = (invitation: EnrollmentInvitationShow) =>
    `${invitation.user.firstName} ${invitation.user.lastName}`

  const handleViewMessageClick = (title: string, message: string) => {
    modals.open({
      title,
      centered: true,
      children: <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(message) }} />,
    })
  }

  const handleEditClick = (invitation: EnrollmentInvitationShow) => {
    modals.open({
      title: `Editar invitación a ${userFullName(invitation)}`,
      centered: true,
      children: (
        <EnrollmentInvitationUpdate
          projectId={props.projectId}
          userId={invitation.user.id}
          content={invitation.adminMessage}
        />
      ),
    })
  }

  const handleCancelClick = (invitation: EnrollmentInvitationShow, isDeclined: boolean) => {
    modals.openConfirmModal({
      title: isDeclined ? 'Descartar invitación' : 'Cancelar invitación',
      centered: true,
      children: (
        <Text>
          {isDeclined
            ? `La invitación declinada por ${userFullName(invitation)} será eliminada.`
            : `La invitación a ${userFullName(invitation)} será cancelada.`}
        </Text>
      ),
      labels: { confirm: 'Eliminar', cancel: 'Volver' },
      confirmProps: { color: 'red' },
      onConfirm: () => cancelInvitationMutation.mutate(invitation.user.id),
    })
  }

  if (invitationsQuery.isLoading) return <Loader type="dots" mt="md" />
  if (invitationsQuery.isError)
    return (
      <Alert color="red" mt="md">
        {ApiErrors.message(
          invitationsQuery.error,
          'No se pudieron cargar las invitaciones de inscripción'
        )}
      </Alert>
    )

  const invitations = invitationsQuery.data?.enrollmentInvitations ?? []
  if (invitations.length === 0)
    return (
      <Text mt="md" data-testid="invitation-list-empty">
        No hay invitaciones pendientes ni declinadas
      </Text>
    )

  return (
    <>
      {invitations.map((invitation) => {
        const isDeclined = invitation.requestState === RequestState.Declined
        const { adminMessage, requesterMessage } = invitation

        return (
          <Card key={invitation.id} p="md" mt="md" withBorder data-testid="invitation-card">
            <Group justify="space-between">
              <Anchor
                component={Link}
                href={`/users/${invitation.user.id}`}
                size="lg"
                data-testid="invitation-card-user">
                {userFullName(invitation)}
              </Anchor>
              <Badge
                color={isDeclined ? 'red' : 'blue'}
                variant="light"
                data-testid="invitation-card-state">
                {isDeclined ? 'Declinada' : 'Pendiente'}
              </Badge>
            </Group>

            <Text size="sm" mt="xs" data-testid="invitation-card-sender">
              Invitado por {invitation.sender.firstName} {invitation.sender.lastName} el{' '}
              {Dates.formatDate(invitation.creationDate)}
            </Text>

            <Group justify="flex-end" mt="xs">
              {adminMessage && (
                <ActionIcon
                  aria-label="Ver mensaje de la invitación"
                  data-testid="invitation-card-view-message"
                  size="lg"
                  color="gray"
                  onClick={() => handleViewMessageClick('Mensaje de la invitación', adminMessage)}>
                  <IconBubbleText />
                </ActionIcon>
              )}
              {isDeclined && requesterMessage && (
                <ActionIcon
                  aria-label="Ver respuesta del usuario"
                  data-testid="invitation-card-view-answer"
                  size="lg"
                  color="gray"
                  onClick={() =>
                    handleViewMessageClick(
                      `Respuesta de ${userFullName(invitation)}`,
                      requesterMessage
                    )
                  }>
                  <IconBubbleText />
                </ActionIcon>
              )}
              {!isDeclined && (
                <ActionIcon
                  aria-label="Editar invitación"
                  data-testid="invitation-card-edit"
                  size="lg"
                  color="orange.6"
                  onClick={() => handleEditClick(invitation)}>
                  <IconEdit />
                </ActionIcon>
              )}
              <ActionIcon
                aria-label={isDeclined ? 'Descartar invitación' : 'Cancelar invitación'}
                data-testid="invitation-card-remove"
                size="lg"
                color="red"
                loading={
                  cancelInvitationMutation.isPending &&
                  cancelInvitationMutation.variables === invitation.user.id
                }
                onClick={() => handleCancelClick(invitation, isDeclined)}>
                <IconTrash />
              </ActionIcon>
            </Group>
          </Card>
        )
      })}
    </>
  )
}
