import React from 'react'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Projects } from '../../services/projects'
import TextEditor from '../Common/TextEditor/TextEditor'
import { EnrollmentRequestReject } from '../../entities/HelpTypes/EnrollmentRequestReject'
import { EnrollmentRequestShow } from '../../entities/HelpTypes/EnrollmentRequestShow'
import { Button, LoadingOverlay, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import sanitizeHtml from 'sanitize-html'

interface EnrollmentRequestProps {
  projectId: number
  request: EnrollmentRequestShow
}

export const EnrollmentRequestRejectForm = (props: EnrollmentRequestProps): React.JSX.Element => {
  const form = useForm({ initialValues: { message: '' } })
  const queryClient = useQueryClient()

  const rejectEnrollmentRequestMutation = useMutation({
    mutationFn: async (params: { userId: number; rejectOptions: EnrollmentRequestReject }) =>
      Projects.rejectEnrollmentRequest(props.projectId, params.userId, params.rejectOptions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollmentRequests', props.projectId] })
      notifications.show({
        title: 'Solicitud de inscripción rechazada',
        message: 'El usuario sera notificado de la decisión',
        color: 'blue',
      })
      modals.closeAll()
    },
    onError: (error) => {
      console.error(error)
      notifications.show({
        title: 'Error al rechazar la solicitud de inscripción',
        message: 'Por favor, inténtalo de nuevo más tarde',
        color: 'red',
      })
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    const sanitizedMessage = sanitizeHtml(values.message)
    rejectEnrollmentRequestMutation.mutate({
      userId: props.request.user.id,
      rejectOptions: {
        message: sanitizedMessage,
      },
    })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay
        visible={rejectEnrollmentRequestMutation.isPending}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <Text style={{ marginBottom: '1rem' }}>
        [Opcional] ¿Por qué deseas rechazar la solicitud de inscripción de{' '}
        {props.request.user.firstName} {props.request.user.lastName}?
      </Text>
      <TextEditor onChange={(content) => form.setValues({ message: content })} />
      <Button type="submit" fullWidth mt="md" aria-label="Rechazar solicitud" color="red">
        Rechazar
      </Button>
    </form>
  )
}
