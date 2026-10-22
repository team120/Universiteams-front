import React from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Button, LoadingOverlay, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { modals } from '@mantine/modals'

import { EnrollmentRequestsQueryKey, Projects } from '@/services/projects'
import sanitizeHtml from 'sanitize-html'

import { EnrollmentRequestInput } from '@/entities/Enrollment/EnrollmentRequestInput'
import { EnrollmentRequestShow } from '@/entities/Enrollment/EnrollmentRequestShow'
import { ManageEnrollInvitationAction } from '@/entities/Project/ProjectInList'
import TextEditor from '@/components/Common/TextEditor/TextEditor'

interface UserMutation {
  userOptions: EnrollmentRequestInput
}

interface EnrollmentRequestUserProps {
  projectId: number
  request: EnrollmentRequestShow
  action: ManageEnrollInvitationAction
}

export const EnrollmentRequestUser = (props: EnrollmentRequestUserProps): React.JSX.Element => {
  const form = useForm({ initialValues: { message: '' } })
  const queryClient = useQueryClient()

  const acceptEnrollmentInvitationMutation = useMutation({
    mutationFn: async (params: UserMutation) =>
      Projects.acceptEnrollmentInvitation(props.projectId, params.userOptions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EnrollmentRequestsQueryKey, props.projectId] })
      notifications.show({
        title: 'Invitación de inscripción aceptada',
        message: 'Ahora eres miembro del proyecto',
        color: 'blue',
      })
      modals.closeAll()
    },
    onError: (error) => {
      console.error(error)
      notifications.show({
        title: 'Error al aceptar la invitación de inscripción',
        message: 'Por favor, inténtalo de nuevo más tarde',
        color: 'red',
      })
    },
  })

  const declineEnrollmentRequestMutation = useMutation({
    mutationFn: async (params: UserMutation) =>
      Projects.declineEnrollmentInvitation(props.projectId, params.userOptions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EnrollmentRequestsQueryKey, props.projectId] })
      notifications.show({
        title: 'Invitación de inscripción declinada',
        message: 'El admin o líder sera notificado de la decisión',
        color: 'blue',
      })
      modals.closeAll()
    },
    onError: (error) => {
      console.error(error)
      notifications.show({
        title: 'Error al declinar la invitación de inscripción',
        message: 'Por favor, inténtalo de nuevo más tarde',
        color: 'red',
      })
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    const sanitizedMessage = sanitizeHtml(values.message)

    switch (props.action) {
      case 'accept':
        acceptEnrollmentInvitationMutation.mutate({
          userOptions: {
            message: sanitizedMessage,
          },
        })
        break
      case 'decline':
        declineEnrollmentRequestMutation.mutate({
          userOptions: {
            message: sanitizedMessage,
          },
        })
        break
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay
        visible={
          props.action === 'accept'
            ? acceptEnrollmentInvitationMutation.isPending
            : declineEnrollmentRequestMutation.isPending
        }
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <Text style={{ marginBottom: '1rem' }}>
        {props.action === 'decline'
          ? `[Opcional] ¿Por qué rechazas la invitación de inscripción? Este mensaje será enviado al admin o líder`
          : '[Opcional] Indica un mensaje para el admin o líder que te invitó. Por ejemplo, preguntas para comenzar a colaborar'}
      </Text>
      <TextEditor onChange={(content) => form.setValues({ message: content })} />
      <Button
        type="submit"
        fullWidth
        mt="md"
        aria-label="Aceptar o declinar invitación"
        color={props.action === 'accept' ? 'blue' : 'red'}>
        {props.action === 'accept' ? 'Aceptar invitación' : 'Declinar invitación'}
      </Button>
    </form>
  )
}
