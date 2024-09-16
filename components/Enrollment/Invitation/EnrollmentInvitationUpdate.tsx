import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, LoadingOverlay } from '@mantine/core'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'

import { ProjectsQueryKey } from '@/services/projects'
import { Users } from '@/services/users'
import sanitizeHtml from 'sanitize-html'

import { EnrollmentRequestInput } from '@/entities/Enrollment/EnrollmentRequestInput'
import TextEditor from '@/components/Common/TextEditor/TextEditor'

interface EnrollmentInvitationUpdateProps {
  userId: number
  projectId: number
  content?: string
}

export const EnrollmentInvitationUpdate = (props: EnrollmentInvitationUpdateProps) => {
  const form = useForm({ initialValues: { message: '' } })
  const queryClient = useQueryClient()

  const enrollmentInvitationUpdateMutation = useMutation({
    mutationFn: async (enrollmentRequest: EnrollmentRequestInput) => {
      return Users.updateEnrollInvitation(props.userId, props.projectId, enrollmentRequest)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ProjectsQueryKey] })
      notifications.show({
        title: 'Invitación de inscripción actualizada',
        message: 'Espera a que el usuario acepte tu invitación de inscripción',
      })
      modals.closeAll()
    },
    onError: (error) => {
      console.error('Enrollment invitation failed:', error)
      notifications.show({
        title: 'Error al actualizar la invitación de inscripción',
        message: 'Por favor, inténtalo de nuevo más tarde',
        color: 'red',
      })
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    const sanitizedMessage = sanitizeHtml(values.message)
    enrollmentInvitationUpdateMutation.mutate({ message: sanitizedMessage })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay
        visible={enrollmentInvitationUpdateMutation.isPending}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <TextEditor
        content={props.content}
        onChange={(content) => form.setValues({ message: content })}
      />

      <Button type="submit" fullWidth mt="md">
        Actualizar
      </Button>
    </form>
  )
}
