import React, { useEffect, useMemo } from 'react'

import { Alert, Button, Center, Container, Loader, Paper, Stack, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import {
  Account,
  ResearchDepartmentInput,
  ProfileInputDto as UserRegisterDto,
} from '../../services/account'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import MultiSelectCreatable from '../Common/Form/MultiSelectCreatable'
import { notifications } from '@mantine/notifications'
import { DepartmentQueryKey, ResearchDepartments } from '../../services/departments'
import { InterestQueryKey, Interests } from '../../services/interests'
import SelectItem from '../../entities/HelpTypes/SelectItem'
import { IconExclamationCircle } from '@tabler/icons-react'
import { AxiosError } from 'axios'
import DepartmentMultiSelect from '../Department/DepartmentMultiSelect'
import { UserAffiliationType } from '../../entities/UserAffiliation'

type ProfileForm = {
  interests: SelectItem[]
  researchDepartments: ResearchDepartmentInput[]
}

const Profile = () => {
  const router = useRouter()

  const form = useForm<ProfileForm>({
    initialValues: {
      interests: [],
      researchDepartments: [],
    },
  })

  const {
    data: userProfile,
    error: userProfileErr,
    isLoading: isLoadingUserProfile,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: () => Account.getProfile(),
  })

  const currentInterests: SelectItem[] | undefined = useMemo(
    () =>
      userProfile?.interests.map((interest) => ({
        value: interest.id.toString(),
        label: interest.name,
      })),
    [userProfile]
  )

  useEffect(() => {
    if (currentInterests) {
      form.setFieldValue('interests', currentInterests)
    }
  }, [currentInterests])

  const currentDepartments: SelectItem[] | undefined = useMemo(
    () =>
      userProfile?.userAffiliations.map((affiliation) => ({
        value: affiliation.researchDepartment.id.toString(),
        label: affiliation.researchDepartment.name,
      })),
    [userProfile]
  )

  useEffect(() => {
    if (currentDepartments) {
      form.setFieldValue(
        'researchDepartmentsIds',
        currentDepartments.map((dept) => Number(dept.value))
      )
    }
  }, [currentDepartments])

  const departmentsQuery = useQuery({
    queryKey: [DepartmentQueryKey],
    queryFn: () =>
      ResearchDepartments.getResearchDepartments({
        relations: ['facility', 'facility.institution'],
      }),
    enabled: userProfileErr === null,
  })

  const interestsQuery = useQuery({
    queryKey: [InterestQueryKey],
    queryFn: Interests.getInterests,
    enabled: userProfileErr === null,
  })
  const interests: SelectItem[] = useMemo(
    () =>
      interestsQuery.data?.map((interest) => ({
        value: interest.id.toString(),
        label: interest.name,
      })) ?? [],
    [interestsQuery.data]
  )

  const registerProfileMutation = useMutation({
    mutationFn: (values: UserRegisterDto) => Account.saveProfile(values),
    onSuccess: () => {
      notifications.show({
        title: 'Perfil completado',
        message: 'Tu perfil ha sido completado con éxito.',
        color: 'green',
      })
      router.push('/')
    },
    onError: (error) => {
      console.error(error)
      notifications.show({
        title: 'Error',
        message: 'No se pudo completar el registro. Inténtalo mas tarde.',
        color: 'red',
      })
    },
  })

  const handleDepartmentsChange = (departments: string[]) => {
    form.setFieldValue(
      'researchDepartments',
      departments.map((dept) => {
        const [currentType, departmentId] = dept.split(':')

        return {
          id: Number(departmentId),
          currentType: currentType as UserAffiliationType,
        }
      })
    )
  }

  const handleSubmit = (values: ProfileForm) => {
    const interestsIds: number[] = []
    const interestsToCreate: string[] = []
    for (const interest of values.interests) {
      const parsedValue = parseInt(interest.value, 10)
      if (!isNaN(parsedValue)) {
        interestsIds.push(parsedValue)
        continue
      }

      interestsToCreate.push(interest.label)
    }

    console.log({
      interestsIds: interestsIds,
      interestsToCreate: interestsToCreate,
      researchDepartments: values.researchDepartments,
    })

    registerProfileMutation.mutate({
      interestsIds: interestsIds,
      interestsToCreate: interestsToCreate,
      researchDepartments: values.researchDepartments,
    })
  }

  if (isLoadingUserProfile) {
    return (
      <Container size="xs" my={40}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Center>
            <Loader variant="dots" />
          </Center>
        </Paper>
      </Container>
    )
  }

  if (userProfileErr !== null && (userProfileErr as AxiosError).response?.status === 401) {
    return (
      <Container size="xs" my={40}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Center>
            <Alert
              variant="light"
              color="red"
              title="No autorizado"
              icon={<IconExclamationCircle />}>
              Debes estar autenticado para completar tu perfil
            </Alert>
          </Center>
        </Paper>
      </Container>
    )
  }

  if (userProfileErr !== null) {
    return (
      <Container size="xs" my={40}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Center>
            <Alert variant="light" color="red" title="Error" icon={<IconExclamationCircle />}>
              No se pudo cargar tu perfil
            </Alert>
          </Center>
        </Paper>
      </Container>
    )
  }

  if (departmentsQuery.isLoading || interestsQuery.isLoading) {
    return (
      <Container size="xs" my={40}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Center>
            <Loader variant="dots" />
          </Center>
        </Paper>
      </Container>
    )
  }

  return (
    <Container size="xs" my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Text size="lg" w={500} mb="lg">
            Edita tu perfil
          </Text>

          <Stack gap="lg">
            <div>
              <Text size="sm" mb="sm">
                Intereses
              </Text>
              <MultiSelectCreatable
                possibleValues={interests}
                placeholder="Ej. Domotica"
                {...form.getInputProps('interests')}
              />{' '}
            </div>

            <div>
              <Text size="sm" mb="sm">
                Departamentos
              </Text>

              <DepartmentMultiSelect
                userAffiliations={userProfile?.userAffiliations}
                possibleDepartments={departmentsQuery.data}
                onChange={handleDepartmentsChange}
              />
            </div>
          </Stack>

          <Button mt="lg" fullWidth type="submit">
            Guardar
          </Button>
        </form>
      </Paper>
    </Container>
  )
}

export default Profile
