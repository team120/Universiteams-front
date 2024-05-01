import React from 'react'
import { Textarea, Button, LoadingOverlay } from '@mantine/core'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import { EnrollmentRequest } from '../../entities/HelpTypes/EnrollmentRequest'
import { notifications } from '@mantine/notifications'
import { Projects } from '../../services/projects'
import { useQueryClient, useMutation } from '@tanstack/react-query'

interface EnrollmentRequestProps {
  projectId: number
}

export const EnrollmentRequestModal = (props: EnrollmentRequestProps): React.JSX.Element => {
  const form = useForm({ initialValues: { message: '' } })
  const queryClient = useQueryClient()

  const enrollmentRequestMutation = useMutation({
    mutationFn: async (enrollmentRequest: EnrollmentRequest) => {
      return Projects.requestEnrollment(props.projectId, enrollmentRequest)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      notifications.show({
        title: 'Solicitud de inscripción enviada',
        message: 'Espera a que el líder del proyecto acepte tu solicitud',
      })
      modals.closeAll()
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    enrollmentRequestMutation.mutate({ message: values.message })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay
        visible={enrollmentRequestMutation.isPending}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <Textarea
        label="Puedes ingresar una nota al admin o lider del proyecto (opcional)"
        description="Puedes indicar tus motivaciones, habilidades, disponibilidad, etc."
        placeholder="Escribe aquí tu mensaje"
        data-autofocus
        resize="vertical"
        {...form.getInputProps('message')}
      />
      <Button type="submit" fullWidth mt="md">
        Enviar
      </Button>
    </form>
  )
}
