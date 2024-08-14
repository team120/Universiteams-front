import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Box, Button, Card, useMantineColorScheme } from '@mantine/core'

import { CurrentUserQueryOptions } from '@/services/currentUser'

import { ProjectNewRequest } from '@/entities/Project/ProjectNew'

const ProjectNew = () => {
  const router = useRouter()

  const pathname = usePathname()
  const queryClient = useQueryClient()
  const { colorScheme } = useMantineColorScheme()

  const { data: currentUser, error: errorCurrentUser } = useQuery(
    CurrentUserQueryOptions.currentUser()
  )

  const handleNewProject = () => {
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
  }

  return (
    <Box mx="1.5rem" my={'1rem'}>
      <Card key={1}>Test</Card>
      <Button mt={'1rem'} onClick={() => handleNewProject()}>
        Crear proyecto
      </Button>
    </Box>
  )
}

export default ProjectNew
