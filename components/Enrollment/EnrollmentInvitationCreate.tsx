import React, { useMemo, useState } from 'react'
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { Button, LoadingOverlay, Select, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'

import { Projects, ProjectsQueryKey } from '@/services/projects'
import { CurrentUserQueryOptions } from '@/services/currentUser'
import { Users } from '@/services/users'
import sanitizeHtml from 'sanitize-html'

import { EnrollmentRequestInput } from '@/entities/Enrollment/EnrollmentRequestInput'
import ProjectInList from '@/entities/Project/ProjectInList'
import SelectItem from '@/entities/HelpTypes/SelectItem'
import TextEditor from '@/components/Common/TextEditor/TextEditor'

interface EnrollmentInvitationCreateProps {
  userId: number
}

export const EnrollmentInvitationCreate = (
  props: EnrollmentInvitationCreateProps
): React.JSX.Element => {
  const form = useForm({ initialValues: { message: '' } })
  const queryClient = useQueryClient()

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  const { data: currentUser } = useQuery(CurrentUserQueryOptions.currentUser())

  const projectsQuery = useQuery({
    queryKey: [ProjectsQueryKey, currentUser?.id],
    queryFn: () => Projects.getProjects({ userId: currentUser?.id }),
  })

  const projects: SelectItem[] = useMemo(() => {
    return (
      projectsQuery.data?.projects?.map((project: ProjectInList) => ({
        value: String(project.id),
        label: project.name,
      })) ?? []
    )
  }, [projectsQuery.data])

  const enrollmentInvitationCreateMutation = useMutation({
    mutationFn: async (enrollmentRequest: EnrollmentRequestInput) => {
      if (!selectedProjectId) {
        throw new Error('No se ha seleccionado ningún proyecto')
      }
      return Users.createEnrollInvitation(props.userId, +selectedProjectId, enrollmentRequest)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ProjectsQueryKey] })
      notifications.show({
        title: 'Invitación de inscripción enviada',
        message: 'Espera a que el usuario acepte tu invitación de inscripción',
      })
      modals.closeAll()
    },
    onError: (error) => {
      console.error('Enrollment invitation failed:', error)
      notifications.show({
        title: 'Error al enviar la invitación de inscripción',
        message: 'Por favor, inténtalo de nuevo más tarde',
        color: 'red',
      })
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    const sanitizedMessage = sanitizeHtml(values.message)
    enrollmentInvitationCreateMutation.mutate({ message: sanitizedMessage })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay
        visible={enrollmentInvitationCreateMutation.isPending}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <Select
        label="Proyectos donde soy Admin"
        placeholder="Seleccione proyecto a invitar"
        searchable
        data={projects}
        onChange={(value) => setSelectedProjectId(value)}
      />
      <Text size="lg">[Opcional] Envía un mensaje al usuario</Text>
      <Text size="sm">Puedes indicar tus motivaciones, objetivos, etc.</Text>
      <TextEditor onChange={(content) => form.setValues({ message: content })} />
      <Button type="submit" fullWidth mt="md">
        Invitar
      </Button>
    </form>
  )
}
