import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Box, Button, Flex, MultiSelect, Paper, Select, Text, TextInput } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import {
  IconAlignBoxLeftBottom,
  IconBuildingCommunity,
  IconBuildingEstate,
  IconBulb,
  IconCalendarEvent,
  IconFolder,
  IconInfoSquareRounded,
  IconLanguage,
  IconSchool,
  IconWorldWww,
} from '@tabler/icons-react'

import { CurrentUserQueryOptions } from '@/services/currentUser'
import { Facilities, FacilitiesQueryKey } from '@/services/facilities'
import { InstitutionQueryKey, Institutions } from '@/services/institutions'
import { InterestQueryKey, Interests } from '@/services/interests'
import { Projects, ProjectsQueryKey } from '@/services/projects'
import { DepartmentsQueryKey, ResearchDepartments } from '@/services/departments'

import Institution from '@/entities/Institution'
import Interest from '@/entities/Interest'
import Language from '@/entities/HelpTypes/Language'
import Project from '@/entities/Project/Project'
import { ProjectNewRequest, ProjectNewResponse } from '@/entities/Project/ProjectNew'
import ProjectType from '@/entities/Project/ProjectType'
import ResearchDepartment from '@/entities/ResearchDepartment'

import InfoMessage from '../Common/InfoMessage/InfoMessage'
import { NotLoggedError } from '@/components/Account/NotLoggedError'
import { verifyEmailNotification } from '@/components/Account/VerifyEmailNotification'
import Facility from '../../entities/Facility/Facility'

interface ProjectNewForm extends ProjectNewRequest {
  institutionId?: number
  facilityId?: number
}

interface ProjectCreateUpdateProps {
  id?: number
}

const ProjectCreateUpdate = (props?: ProjectCreateUpdateProps) => {
  const router = useRouter()

  const [createStatus, setCreateStatus] = useState<string>('start')
  const [institutionId, setInstitutionId] = useState<number | undefined>(0)
  const [facilityId, setFacilityId] = useState<number | undefined>(0)

  const currentProjectQuery = useQuery({
    queryKey: [ProjectsQueryKey, props?.id],
    queryFn: () => Projects.getProject(props?.id),
  })

  const currentProject = useMemo(() => currentProjectQuery.data, [currentProjectQuery.data])

  const queryClient = useQueryClient()

  const { data: currentUser, error: errorCurrentUser } = useQuery(
    CurrentUserQueryOptions.currentUser()
  )

  const interestsQuery = useQuery({
    queryKey: [InterestQueryKey],
    queryFn: Interests.getInterests,
  })

  const institutionsQuery = useQuery({
    queryKey: [InstitutionQueryKey],
    queryFn: Institutions.getInstitutions,
  })

  const facilitiesQuery = useQuery({
    queryKey: [FacilitiesQueryKey, institutionId ?? 0],
    queryFn: () => Facilities.getFacilities({ institutionId: institutionId ?? 0 }),
    enabled: !!institutionId,
  })

  const departmentsQuery = useQuery({
    queryKey: [DepartmentsQueryKey, facilityId ?? 0],
    queryFn: () =>
      ResearchDepartments.getResearchDepartments({
        facilityId: facilityId ?? 0,
      }),
    enabled: !!facilityId,
  })

  const handleGoBack = () => {
    router.push('/projects')
  }

  const handleUniversityChange = (value: string | null) => {
    setInstitutionId(!value ? undefined : +value)
    setFacilityId(undefined)
    form.setFieldValue('facilityId', undefined)
    form.setFieldValue('researchDepartmentsIds', [])
  }

  const handleFacilityChange = (value: string | null) => {
    setFacilityId(!value ? undefined : +value)
    form.setFieldValue('researchDepartmentsIds', [])
  }

  const createUpdateProjectMutation = useMutation({
    mutationFn: async (values: ProjectNewForm) => {
      if (errorCurrentUser || !currentUser) {
        notifications.show({
          title: 'Debes iniciar sesión para crear o modificar proyectos',
          color: 'red',
          message: <NotLoggedError action="crear o modificar proyectos" />,
        })

        return Promise.reject('User not logged in')
      }

      if (currentUser?.isEmailVerified === false) {
        notifications.show(verifyEmailNotification('crear o modificar proyectos'))

        return Promise.reject('Email not verified')
      }

      // Set the project values ignoring facilityID and institutionID
      const newProject: ProjectNewRequest = { ...values }

      // Format the date correctly (if given)
      if (newProject.endDate) {
        const date: Date = newProject.endDate as unknown as Date
        newProject.endDate = date.toISOString()
      }

      // Validate IDs as integers
      newProject.interestsIds = newProject.interestsIds.map((id) => +id)
      newProject.researchDepartmentsIds = newProject.researchDepartmentsIds.map((id) => +id)

      // If id exists, update the project
      if (props?.id) {
        if (!currentProject?.requestEnrollmentCount) {
          notifications.show({
            title: 'Debes tener el rol de líder de proyecto para modificar este proyecto',
            color: 'red',
            message:
              'Solo puedes modificar los proyectos en los que tienes el rol de líder. Consulta al líder de tu proyecto para realizar esta acción',
          })

          return Promise.reject('No leader role')
        }

        const updatedProject: ProjectNewResponse = await Projects.updateProject(
          props.id,
          newProject
        )
        if (!updatedProject || updatedProject.id == 0) {
          return Promise.reject('Project not updated')
        }

        return Promise.resolve(updatedProject)
      }

      // Without id, create a new project
      const createdProject: ProjectNewResponse = await Projects.newProject(newProject)
      if (!createdProject || createdProject.id == 0) {
        return Promise.reject('Project not created')
      }

      return Promise.resolve(createdProject)
    },
    onSuccess: () => {
      const key = 'project-create-update'
      queryClient.invalidateQueries({ queryKey: [key] })
      setCreateStatus('success')
      notifications.show({
        title: `Proyecto ${props?.id ? `#${props.id} modificado` : 'creado'}`,
        message: `Tu proyecto ha sido ${props?.id ? 'modificado' : 'creado'} con éxito.`,
        color: 'green',
      })
    },
    onError: (error) => {
      console.error(error)
      setCreateStatus('fail')
      notifications.show({
        title: 'Error',
        message: `No se pudo ${
          props?.id ? 'modificar' : 'crear'
        } el proyecto. Inténtalo mas tarde.`,
        color: 'red',
      })
    },
  })

  const mutationFailMessage = () => {
    return (
      <Box mx={'-1.5rem'} pt={'1.5rem'}>
        <InfoMessage
          text={`Ocurrió un error al ${
            props?.id ? 'modificar' : 'crear'
          } proyecto, inténtalo mas tarde`}
          type={'error'}
        />
        <Button mx={'1.5rem'} onClick={() => handleGoBack()}>
          Volver a Proyectos
        </Button>
      </Box>
    )
  }

  const mutationSuccessMessage = () => {
    return (
      <Box mx={'-1.5rem'} pt={'1.5rem'}>
        <InfoMessage
          text={`El proyecto ha sido ${props?.id ? 'modificado' : 'creado'} con éxito`}
          type={'info'}
        />
        <Button mx={'1.5rem'} onClick={() => handleGoBack()}>
          Volver a Proyectos
        </Button>
      </Box>
    )
  }

  const validateText = (value?: string) => {
    if (!value) return 'Este campo es obligatorio'
    if (value.length > 256) return 'Máximo 256 caracteres'
    return null
  }

  const validateArray = (array?: number[]) => {
    if (!Array.isArray(array) || array.length == 0) {
      return 'Este campo debe tener al menos 1 elemento'
    }
    if (array.length > 20) {
      return 'Este campo debe tener como máximo 20 elementos'
    }
    return null
  }

  const form = useForm<ProjectNewForm>({
    initialValues: !props?.id
      ? {
          // Update project
          name: currentProject?.name ?? '',
          type: (currentProject?.type as ProjectType) ?? 'Informal',
          // language: currentProject?.language as Language ?? 'spanish',
          language: 'spanish',
          description: currentProject?.description,
          endDate: currentProject?.endDate,
          //web: currentProject?.web,
          web: '',
          interestsIds: [],
          interestsToCreate: [],
          institutionId: undefined,
          facilityId: undefined,
          researchDepartmentsIds: [],
        }
      : {
          // Create project
          name: '',
          type: 'Informal',
          language: 'spanish',
          description: '',
          endDate: undefined,
          web: undefined,
          interestsIds: [],
          interestsToCreate: [],
          institutionId: undefined,
          facilityId: undefined,
          researchDepartmentsIds: [],
        },

    validate: {
      name: (value: string) => validateText(value),
      type: (value: ProjectType) => validateText(value),
      language: (value: Language) => validateText(value),
      interestsIds: (value: number[]) => validateArray(value),
      researchDepartmentsIds: (value: number[]) => validateArray(value),
    },
  })

  return (
    <>
      <Paper withBorder shadow="md" mx={'1.5rem'} my={'1rem'} p={'2rem'} radius="md">
        <Text size="2rem" mb="2rem">
          {props?.id ? `Modificar proyecto #${props.id}` : 'Nuevo proyecto'}
        </Text>
        <form
          onSubmit={form.onSubmit((values: ProjectNewForm) =>
            createUpdateProjectMutation.mutate(values)
          )}>
          <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
            <IconFolder size={'2rem'} />
            <TextInput
              flex={1}
              label="Nombre"
              placeholder="Gran proyecto de robótica"
              required
              {...form.getInputProps('name')}
            />
          </Flex>
          <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
            <IconInfoSquareRounded size={'2rem'} />
            <Select
              styles={{ input: { cursor: 'pointer' } }}
              labelProps={{ cursor: 'pointer' }}
              flex={1}
              label="Tipo"
              placeholder="Formal"
              data={['Formal', 'Informal']}
              required
              clearable
              searchable
              {...form.getInputProps('type')}
            />
          </Flex>
          <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
            <IconLanguage size={'2rem'} />
            <Select
              styles={{ input: { cursor: 'pointer' } }}
              labelProps={{ cursor: 'pointer' }}
              flex={1}
              label="Idioma"
              placeholder="Español"
              data={['spanish', 'english']}
              required
              clearable
              searchable
              {...form.getInputProps('language')}
            />
          </Flex>
          <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
            <IconAlignBoxLeftBottom size={'2rem'} />
            <TextInput
              flex={1}
              label="Descripción"
              placeholder="Movilización de piezas robóticas mediante wifi"
              {...form.getInputProps('description')}
            />
          </Flex>
          <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
            <IconCalendarEvent size={'2rem'} />
            <DateInput
              styles={{ input: { cursor: 'pointer' } }}
              labelProps={{ cursor: 'pointer' }}
              flex={1}
              label="Fecha de finalización"
              placeholder="Fecha de finalización"
              minDate={new Date()}
              clearable
              {...form.getInputProps('endDate')}
            />
          </Flex>
          <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
            <IconWorldWww size={'2rem'} />
            <TextInput
              flex={1}
              label="Web"
              placeholder="www.universidadRobotica.com/projectos/20"
              {...form.getInputProps('web')}
            />
          </Flex>
          <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
            <IconBulb size={'2rem'} />
            <MultiSelect
              styles={{ inputField: { cursor: 'pointer' } }}
              labelProps={{ cursor: 'pointer' }}
              flex={1}
              label="Intereses"
              placeholder={form.values.interestsIds.length == 0 ? 'Robótica, Redes' : ''}
              data={
                interestsQuery?.data
                  ? interestsQuery.data.map((interest: Interest) => ({
                      value: interest.id.toString(),
                      label: interest.name,
                    }))
                  : []
              }
              required
              clearable
              searchable
              {...form.getInputProps('interestsIds')}
            />
          </Flex>
          <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
            <IconBuildingCommunity size={'2rem'} />
            <Select
              styles={{ input: { cursor: 'pointer' } }}
              labelProps={{ cursor: 'pointer' }}
              flex={1}
              label="Universidad"
              placeholder="Universidad de Robótica"
              data={
                institutionsQuery?.data
                  ? institutionsQuery.data.map((institution: Institution) => ({
                      value: institution.id.toString(),
                      label: institution.name,
                    }))
                  : []
              }
              required
              clearable
              searchable
              onChange={handleUniversityChange}
            />
          </Flex>
          <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
            <IconBuildingEstate size={'2rem'} />
            <Select
              styles={
                !institutionId
                  ? { input: { cursor: 'not-allowed' } }
                  : { input: { cursor: 'pointer' } }
              }
              labelProps={!institutionId ? { cursor: 'default' } : { cursor: 'pointer' }}
              flex={1}
              label="Regional"
              placeholder="Facultad regional de Rosario"
              disabled={!institutionId}
              data={
                facilitiesQuery?.data
                  ? facilitiesQuery.data.map((facility: Facility) => ({
                      value: facility.id.toString(),
                      label: facility.name,
                    }))
                  : []
              }
              required
              clearable
              searchable
              onChange={handleFacilityChange}
            />
          </Flex>
          <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
            <IconSchool size={'2rem'} />
            <MultiSelect
              styles={
                !facilityId
                  ? { inputField: { cursor: 'not-allowed' } }
                  : { inputField: { cursor: 'pointer' } }
              }
              labelProps={!facilityId ? { cursor: 'default' } : { cursor: 'pointer' }}
              flex={1}
              label="Departamentos"
              placeholder={
                form.values.researchDepartmentsIds.length == 0 ? 'Ingeniería electrónica' : ''
              }
              disabled={!facilityId}
              data={
                departmentsQuery?.data
                  ? departmentsQuery.data.map((department: ResearchDepartment) => ({
                      value: department.id.toString(),
                      label: department.name,
                    }))
                  : []
              }
              required
              clearable
              searchable
              {...form.getInputProps('researchDepartmentsIds')}
            />
          </Flex>
          {createStatus == 'fail' && mutationFailMessage()}
          {createStatus == 'success' ? (
            mutationSuccessMessage()
          ) : (
            <Button type="submit" mt={'3rem'} color="orange.9">
              {props?.id ? 'Modificar proyecto' : 'Crear proyecto'}
            </Button>
          )}
        </form>
      </Paper>
    </>
  )
}

export default ProjectCreateUpdate
