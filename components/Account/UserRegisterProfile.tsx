import React, { useMemo } from 'react'

import {
  Anchor,
  Button,
  Center,
  Container,
  Loader,
  MultiSelect,
  Paper,
  Stack,
  Text,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { Account, RegisterProfile } from '../../services/account'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import MultiSelectCreatable from '../Common/Form/MultiSelectCreatable'
import { notifications } from '@mantine/notifications'
import { DepartmentQueryKey, ResearchDepartments } from '../../services/departments'
import { InterestQueryKey, Interests } from '../../services/interests'
import SelectItem from '../../entities/HelpTypes/SelectItem'

const UserRegisterProfile = () => {
  const router = useRouter()

  const form = useForm<RegisterProfile>({
    initialValues: {
      interestsIds: [],
      researchDepartmentsIds: [],
    },
  })

  const departmentsQuery = useQuery({
    queryKey: [DepartmentQueryKey],
    queryFn: () =>
      ResearchDepartments.getResearchDepartments({
        relations: ['facility', 'facility.institution'],
      }),
  })
  const departments: SelectItem[] = useMemo(
    () =>
      departmentsQuery.data?.map((department) => ({
        value: department.id.toString(),
        label: `${department.facility.institution.abbreviation} ${department.facility.abbreviation} ${department.name}`,
      })) ?? [],
    [departmentsQuery.data]
  )

  const interestsQuery = useQuery({
    queryKey: [InterestQueryKey],
    queryFn: Interests.getInterests,
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
    mutationFn: (values: RegisterProfile) => Account.registerProfile(values),
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

  const handleSubmit = (values: RegisterProfile) => {
    console.log(values)
    registerProfileMutation.mutate(values)
  }

  const handleCompleteLaterClick = () => {
    notifications.show({
      title: 'Completar más tarde',
      message: 'Ingresa a tu perfil para completar tu información luego.',
      color: 'blue',
    })
    router.push('/')
  }

  return (
    <Container size="xs" my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {departmentsQuery.isLoading && interestsQuery.isLoading && (
          <Center>
            <Loader variant="dots" />
          </Center>
        )}
        {!departmentsQuery.isLoading && !interestsQuery.isLoading && (
          <>
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
              <Text size="lg" w={500} mb="lg">
                Completa tu perfil
              </Text>

              <Stack gap="lg">
                <div>
                  <Text size="sm" mb="sm">
                    Intereses
                  </Text>
                  <MultiSelectCreatable
                    possibleValues={interests}
                    placeholder="Ej. Domotica"
                    onChange={(newValue) =>
                      form.setFieldValue(
                        'interestsIds',
                        newValue.map((v) => Number(v.value))
                      )
                    }
                  />{' '}
                </div>

                <div>
                  <Text size="sm" mb="sm">
                    Departamentos
                  </Text>

                  <MultiSelect
                    placeholder={
                      form.values.researchDepartmentsIds.length === 0
                        ? 'Ej. "Departamento de Ingeniería en Sistemas"'
                        : ''
                    }
                    data={departments}
                    searchable
                    clearable
                    limit={20}
                    nothingFoundMessage="No se encontraron departamentos"
                    onChange={(newValue) =>
                      form.setFieldValue(
                        'researchDepartmentsIds',
                        newValue.map((v) => Number(v))
                      )
                    }
                  />
                </div>
              </Stack>

              <Stack mt="lg">
                <Anchor<'a'> onClick={handleCompleteLaterClick} href="#" size="sm">
                  Omitir y completar más tarde
                </Anchor>

                <Button fullWidth type="submit">
                  Guardar
                </Button>
              </Stack>
            </form>
          </>
        )}
      </Paper>
    </Container>
  )
}

export default UserRegisterProfile
