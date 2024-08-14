import React, { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Box, Button, Card, useMantineColorScheme } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import { CurrentUserQueryOptions } from '@/services/currentUser'
import { Projects } from '@/services/projects'

import InfoMessage from '../Common/InfoMessage/InfoMessage'
import { NotLoggedError } from '@/components/Account/NotLoggedError'
import { ProjectNewRequest, ProjectNewResponse } from '@/entities/Project/ProjectNew'
import { verifyEmailNotification } from '@/components/Account/VerifyEmailNotification'

const ProjectNew = () => {
  const router = useRouter()

  const [createStatus, setCreateStatus] = useState('start')

  useEffect(() => {
    setCreateStatus('start')
  }, [])

  const pathname = usePathname()
  const queryClient = useQueryClient()
  const { colorScheme } = useMantineColorScheme()

  const { data: currentUser, error: errorCurrentUser } = useQuery(
    CurrentUserQueryOptions.currentUser()
  )

  const handleGoBack = () => {
    router.push('/projects')
  }

  const createProjectMutation = useMutation({
    mutationFn: async () => {
      if (errorCurrentUser || !currentUser) {
        notifications.show({
          title: 'Debes iniciar sesión para crear proyectos',
          color: 'red',
          message: <NotLoggedError action="crear proyectos" />,
        })

        return Promise.reject('User not logged in')
      }

      if (currentUser?.isEmailVerified === false) {
        notifications.show(verifyEmailNotification('crear proyectos'))

        return Promise.reject('Email not verified')
      }

      const newProject: ProjectNewRequest = {
        name: '',
        type: 'Informal',
        language: 'spanish',
        description: '',
        endDate: '',
        web: '',
        requesterMessage: '',
        interestsIds: [],
        interestsToCreate: [],
        researchDepartmentsIds: [],
      }

      const createdProject: ProjectNewResponse = await Projects.newProject(newProject)
      if (!createdProject || createdProject.id == 0) {
        return setCreateStatus('fail')
      } else {
        return setCreateStatus('success')
      }
    },
    onSuccess: () => {
      const key = 'project-new'
      queryClient.invalidateQueries({ queryKey: [key] })
    },
  })

  const mutationFailMessage = () => {
    return (
      <>
        <InfoMessage
          text={'Ocurrió un error al crear proyecto, intente de nuevo más tarde'}
          type={'error'}
        />
        <Button mx={'1.5rem'} onClick={() => handleGoBack()}>
          Volver a 'Proyectos'
        </Button>
      </>
    )
  }

  const mutationSuccessMessage = () => {
    return (
      <>
        <InfoMessage text={`El proyecto ha sido creado con éxito`} type={'info'} />
        <Button mx={'1.5rem'} onClick={() => handleGoBack()}>
          Volver a 'Proyectos'
        </Button>
      </>
    )
  }

  return (
    <>
      <Box mx="1.5rem" my={'1rem'}>
        <Card key={1}>Test</Card>
        <Button mt={'1rem'} onClick={() => createProjectMutation.mutate()}>
          Crear proyecto
        </Button>
      </Box>
      {createStatus === 'fail' && mutationFailMessage()}
      {createStatus === 'success' && mutationSuccessMessage()}
    </>
  )
}

export default ProjectNew
