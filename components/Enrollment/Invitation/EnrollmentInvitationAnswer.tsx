import React from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Button, LoadingOverlay, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { modals } from '@mantine/modals'

import { Projects, ProjectsQueryKey } from '@/services/projects'
import { UsersQueryKey } from '@/services/users'
import sanitizeHtml from 'sanitize-html'
import ApiErrors from 'utils/string/ApiErrors'

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
      queryClient.invalidateQueries({ queryKey: [UsersQueryKey] })
      notifications.show({
        title: isAccept
          ? 'Invitación de inscripción aceptada'
          : 'Invitación de inscripción declinada',
        message: isAccept
          ? 'Ahora eres miembro del proyecto'
          : 'Los admins y líderes del proyecto verán tu respuesta en sus invitaciones',
        color: 'blue',
      })
      modals.closeAll()
    },
    onError: (error) => {
      console.error(error)
      // The invitation may have been canceled or changed in the meantime
      queryClient.invalidateQueries({ queryKey: [ProjectsQueryKey] })
      notifications.show({
        title: isAccept
          ? 'Error al aceptar la invitación de inscripción'
          : 'Error al declinar la invitación de inscripción',
        message: ApiErrors.message(error, 'Por favor, inténtalo de nuevo más tarde'),
        color: 'red',
      })
    },
  })

  // Only a decline message is shown to the admins, in their list of invitations
  const handleSubmit = (values: typeof form.values) => {
    answerInvitationMutation.mutate(isAccept ? {} : { message: sanitizeHtml(values.message) })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay
        visible={answerInvitationMutation.isPending}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      {isAccept ? (
        <Text>Te unirás al proyecto como miembro.</Text>
      ) : (
        <>
          <Text style={{ marginBottom: '1rem' }}>
            [Opcional] ¿Por qué declinas la invitación de inscripción? Los admins y líderes del
            proyecto podrán leer tu respuesta
          </Text>
          <TextEditor onChange={(content) => form.setValues({ message: content })} />
        </>
      )}
      <Button type="submit" fullWidth mt="md" color={isAccept ? 'blue' : 'red'}>
        {isAccept ? 'Aceptar invitación' : 'Declinar invitación'}
      </Button>
    </form>
  )
}
