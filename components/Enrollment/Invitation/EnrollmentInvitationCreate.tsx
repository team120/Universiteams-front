import React from 'react'
import { AxiosError } from 'axios'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Button, LoadingOverlay, Select, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'

import { EnrollmentInvitationsQueryKey, Projects } from '@/services/projects'
import sanitizeHtml from 'sanitize-html'

import ProjectInList from '@/entities/Project/ProjectInList'
import TextEditor from '@/components/Common/TextEditor/TextEditor'

interface EnrollmentInvitationCreateProps {
  userId: number
  invitableProjects: ProjectInList[]
}

interface InvitationMutation {
  projectId: number
  message: string
}

export const EnrollmentInvitationCreate = (
  props: EnrollmentInvitationCreateProps
): React.JSX.Element => {
  const form = useForm({
    initialValues: { projectId: '', message: '' },
    validate: {
      projectId: (value) => (value ? null : 'Selecciona un proyecto'),
    },
  })
  const queryClient = useQueryClient()

  const enrollmentInvitationCreateMutation = useMutation({
    mutationFn: async (invitation: InvitationMutation) =>
      Projects.createEnrollmentInvitation(invitation.projectId, props.userId, {
        message: invitation.message,
      }),
    onSuccess: (_, invitation) => {
      queryClient.invalidateQueries({
        queryKey: [EnrollmentInvitationsQueryKey, invitation.projectId],
      })
      notifications.show({
        title: 'Invitación de inscripción enviada',
        message: 'Espera a que el usuario responda tu invitación de inscripción',
      })
      modals.closeAll()
    },
    onError: (error) => {
      console.error('Enrollment invitation failed:', error)
      // The API explains why, e.g. the user was already invited or requested to enroll
      const apiMessage = ((error as AxiosError)?.response?.data as { message?: string })?.message
      notifications.show({
        title: 'Error al enviar la invitación de inscripción',
        message: apiMessage ?? 'Por favor, inténtalo de nuevo más tarde',
        color: 'red',
      })
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    enrollmentInvitationCreateMutation.mutate({
      projectId: Number(values.projectId),
      message: sanitizeHtml(values.message),
    })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay
        visible={enrollmentInvitationCreateMutation.isPending}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <Select
        label="Proyecto"
        placeholder="Selecciona el proyecto al que quieres invitar"
        searchable
        withAsterisk
        mb="md"
        data={props.invitableProjects.map((project) => ({
          value: String(project.id),
          label: project.name,
        }))}
        {...form.getInputProps('projectId')}
      />
      <Text size="lg">[Opcional] Envía un mensaje al usuario</Text>
      <Text size="sm">Puedes indicar tus motivaciones, objetivos, etc.</Text>
      <TextEditor onChange={(content) => form.setFieldValue('message', content)} />
      <Button type="submit" fullWidth mt="md">
        Invitar
      </Button>
    </form>
  )
}
