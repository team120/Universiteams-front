import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, LoadingOverlay } from '@mantine/core'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'

import { EnrollmentInvitationsQueryKey, Projects } from '@/services/projects'
import sanitizeHtml from 'sanitize-html'
import ApiErrors from 'utils/string/ApiErrors'

import { EnrollmentRequestInput } from '@/entities/Enrollment/EnrollmentRequestInput'
import TextEditor from '@/components/Common/TextEditor/TextEditor'

interface EnrollmentInvitationUpdateProps {
  projectId: number
  userId: number
  content?: string
}

export const EnrollmentInvitationUpdate = (props: EnrollmentInvitationUpdateProps) => {
  // Saving without edits must keep the current message
  const form = useForm({ initialValues: { message: props.content ?? '' } })
  const queryClient = useQueryClient()

  const enrollmentInvitationUpdateMutation = useMutation({
    mutationFn: async (invitation: EnrollmentRequestInput) =>
      Projects.updateEnrollmentInvitation(props.projectId, props.userId, invitation),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [EnrollmentInvitationsQueryKey, props.projectId],
      })
      notifications.show({
        title: 'Invitación de inscripción actualizada',
        message: 'Espera a que el usuario responda tu invitación de inscripción',
      })
      modals.closeAll()
    },
    onError: (error) => {
      console.error('Enrollment invitation update failed:', error)
      // The user may have answered the invitation in the meantime
      queryClient.invalidateQueries({
        queryKey: [EnrollmentInvitationsQueryKey, props.projectId],
      })
      notifications.show({
        title: 'Error al actualizar la invitación de inscripción',
        message: ApiErrors.message(error, 'Por favor, inténtalo de nuevo más tarde'),
        color: 'red',
      })
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    enrollmentInvitationUpdateMutation.mutate({ message: sanitizeHtml(values.message) })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay
        visible={enrollmentInvitationUpdateMutation.isPending}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <TextEditor
        label="Mensaje de la invitación"
        content={props.content}
        onChange={(content) => form.setValues({ message: content })}
      />

      <Button type="submit" fullWidth mt="md">
        Actualizar invitación
      </Button>
    </form>
  )
}
