import React from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Button, LoadingOverlay, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { modals } from '@mantine/modals'

import { Projects, ProjectsQueryKey } from '@/services/projects'
import sanitizeHtml from 'sanitize-html'

import { EnrollmentRequestInput } from '@/entities/Enrollment/EnrollmentRequestInput'
import { ManageEnrollInvitationAction } from '@/entities/Project/ProjectInList'
import TextEditor from '@/components/Common/TextEditor/TextEditor'

interface EnrollmentInvitationAnswerProps {
  projectId: number
  action: ManageEnrollInvitationAction
}

export const EnrollmentInvitationAnswer = (
  props: EnrollmentInvitationAnswerProps
): React.JSX.Element => {
  const form = useForm({ initialValues: { message: '' } })
  const queryClient = useQueryClient()

  const isAccept = props.action === 'accept'

  const answerInvitationMutation = useMutation({
    mutationFn: async (answer: EnrollmentRequestInput) =>
      isAccept
        ? Projects.acceptEnrollmentInvitation(props.projectId, answer)
        : Projects.declineEnrollmentInvitation(props.projectId, answer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ProjectsQueryKey] })
      // Accepting adds the project to the user's profile
      queryClient.invalidateQueries({ queryKey: ['users'] })
      notifications.show({
        title: isAccept
          ? 'Invitación de inscripción aceptada'
          : 'Invitación de inscripción declinada',
        message: isAccept
          ? 'Ahora eres miembro del proyecto'
          : 'El admin o líder será notificado de tu decisión',
        color: 'blue',
      })
      modals.closeAll()
    },
    onError: (error) => {
      console.error(error)
      notifications.show({
        title: isAccept
          ? 'Error al aceptar la invitación de inscripción'
          : 'Error al declinar la invitación de inscripción',
        message: 'Por favor, inténtalo de nuevo más tarde',
        color: 'red',
      })
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    answerInvitationMutation.mutate({ message: sanitizeHtml(values.message) })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay
        visible={answerInvitationMutation.isPending}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <Text style={{ marginBottom: '1rem' }}>
        {isAccept
          ? '[Opcional] Indica un mensaje para el admin o líder que te invitó. Por ejemplo, preguntas para comenzar a colaborar'
          : '[Opcional] ¿Por qué declinas la invitación de inscripción? Este mensaje será enviado al admin o líder'}
      </Text>
      <TextEditor onChange={(content) => form.setValues({ message: content })} />
      <Button type="submit" fullWidth mt="md" color={isAccept ? 'blue' : 'red'}>
        {isAccept ? 'Aceptar invitación' : 'Declinar invitación'}
      </Button>
    </form>
  )
}
