import React from 'react'
import { Button, LoadingOverlay, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import { EnrollmentRequest } from '../../entities/HelpTypes/EnrollmentRequest'
import { notifications } from '@mantine/notifications'
import { Projects, ProjectsQueryKey } from '../../services/projects'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import TextEditor from '../Common/TextEditor/TextEditor'

interface EnrollmentRequestProps {
  projectId: number
}

export const EnrollmentRequestCreate = (props: EnrollmentRequestProps): React.JSX.Element => {
  const form = useForm({ initialValues: { message: '' } })
  const queryClient = useQueryClient()

  const enrollmentRequestMutation = useMutation({
    mutationFn: async (enrollmentRequest: EnrollmentRequest) => {
      return Projects.requestEnrollment(props.projectId, enrollmentRequest)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ProjectsQueryKey] })
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
      <Text size="lg">[Opcional] Envía un mensaje al líder o admin del proyecto</Text>
      <Text size="sm">Puedes indicar tus motivaciones, habilidades, disponibilidad, etc.</Text>
      <TextEditor onChange={(content) => form.setValues({ message: content })} />
      <Button type="submit" fullWidth mt="md">
        Solicitar
      </Button>
    </form>
  )
}
