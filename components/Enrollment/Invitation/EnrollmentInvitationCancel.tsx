import React, { useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Group, LoadingOverlay, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'

import { ProjectsQueryKey } from '@/services/projects'
import { Users } from '@/services/users'
import sanitize from 'sanitize-html'

interface EnrollmentInvitationCancelProps {
  userId: number
  projectId: number
  requesterMessage?: string
  adminMessage?: string
}

export const EnrollmentInvitationCancel = (
  props: EnrollmentInvitationCancelProps
): React.JSX.Element => {
  const queryClient = useQueryClient()

  const cancelEnrollmentInvitationMutation = useMutation({
    mutationFn: () => Users.cancelEnrollInvitation(props.userId, props.projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ProjectsQueryKey] })
      notifications.show({
        title: 'Invitación de inscripción cancelada',
        message: 'La invitación de inscripción ha sido eliminada correctamente',
      })
      modals.closeAll()
    },
    onError: (error) => {
      console.error('Error al descartar la invitación de inscripción', error)
      notifications.show({
        title: 'Error al descartar la invitación de inscripción',
        message: 'Por favor, inténtalo de nuevo más tarde',
        color: 'red',
      })
    },
  })

  const handleCancelInvitation = () => {
    cancelEnrollmentInvitationMutation.mutate()
  }

  const requesterMessageSanitized = useMemo(
    () => sanitize(props.requesterMessage || ''),
    [props.requesterMessage]
  )

  const adminMessageSanitized = useMemo(
    () => sanitize(props.adminMessage || ''),
    [props.adminMessage]
  )

  return (
    <>
      <LoadingOverlay
        visible={cancelEnrollmentInvitationMutation.isPending}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />

      {requesterMessageSanitized && (
        <>
          <Text size="lg" fw={700}>
            Tu mensaje
          </Text>
          <div dangerouslySetInnerHTML={{ __html: requesterMessageSanitized }} />
        </>
      )}

      {adminMessageSanitized && (
        <>
          <Text size="lg" fw={700}>
            Mensaje del usuario
          </Text>
          <div dangerouslySetInnerHTML={{ __html: adminMessageSanitized }} />
        </>
      )}

      <Group gap="xs" justify="flex-end">
        <Button color="red" fullWidth onClick={handleCancelInvitation}>
          Descartar
        </Button>
      </Group>
    </>
  )
}
