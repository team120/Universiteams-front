import React, { ChangeEvent, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  Stack,
  Grid,
  ActionIcon,
  Group,
  Switch,
  ComboboxItem,
  MultiSelect,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import { IconArrowUp, IconArrowDown, IconTrash } from '@tabler/icons-react'
import SelectItem from '@/entities/HelpTypes/SelectItem'
import Theme from 'src/app/theme'

interface ProjectFilterContentProps {
  sortAttributes: SelectItem[]
  institutions: SelectItem[]
  facilities: SelectItem[]
  departments: SelectItem[]
  interests: SelectItem[]
  users: SelectItem[]
}

const ProjectFilterContent = (props: ProjectFilterContentProps) => {
  const form = useForm({
    initialValues: {
      generalSearch: '',
      sortBy: '',
      inAscendingOrder: true,
      university: '',
      facility: '',
      department: '',
      user: '',
      interests: [] as string[],
      type: '',
      isDown: false,
      dateFrom: null as Date | null,
    },
  })

  const searchQuery = useSearchParams()

  useEffect(() => {
    form.setValues({
      generalSearch: searchQuery.get('generalSearch') ?? '',
      sortBy: searchQuery.get('sortBy') ?? '',
      inAscendingOrder: searchQuery.get('inAscendingOrder') !== 'false',
      university: searchQuery.get('university') ?? '',
      facility: searchQuery.get('facility') ?? '',
      department: searchQuery.get('department') ?? '',
      user: searchQuery.get('user') ?? '',
      interests: searchQuery.getAll('interest') ?? [],
      type: searchQuery.get('type') ?? '',
      isDown: searchQuery.get('isDown') === 'true',
      dateFrom: searchQuery.get('dateFrom') ? new Date(searchQuery.get('dateFrom')!) : null,
    })
  }, [searchQuery])

  const router = useRouter()
  const pathname = usePathname()

  const handleUrlParamChange = (paramName: string, value: string | null) => {
    const currentUrlParams = new URLSearchParams(searchQuery.toString())

    if (value === null || value === undefined || value === '') {
      currentUrlParams.delete(paramName)
    } else {
      currentUrlParams.set(paramName, value)
    }

    router.push(`${pathname}?${currentUrlParams.toString()}`)
  }

  const handleSortByChange = (value: string | null, _: ComboboxItem) => {
    handleUrlParamChange('sortBy', value)
  }

  const handleUniversityChange = (value: string | null, _: ComboboxItem) => {
    handleUrlParamChange('university', value)
  }

  const handleFacilityChange = (value: string | null, _: ComboboxItem) => {
    handleUrlParamChange('facility', value)
  }

  const handleDepartmentChange = (value: string | null, _: ComboboxItem) => {
    handleUrlParamChange('department', value)
  }

  const handleUserChange = (value: string | null, _: ComboboxItem) => {
    handleUrlParamChange('user', value)
  }

  const handleInterestsChange = (value: string[]) => {
    const currentUrlParams = new URLSearchParams(searchQuery.toString())

    currentUrlParams.delete('interest') // Remove the old interests
    if (value !== null && value !== undefined && value.length > 0) {
      value.forEach((interest) => {
        currentUrlParams.append('interest', interest)
      })
    }

    router.push(`${pathname}?${currentUrlParams.toString()}`)
  }

  const handleTypeChange = (value: string | null, op: ComboboxItem) => {
    handleUrlParamChange('type', value)
  }

  const handleIsDownChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleUrlParamChange('isDown', event.target.checked ? 'true' : 'false')
  }

  const handleDateInputChange = (value: Date | null) => {
    handleUrlParamChange('dateFrom', value ? value.toISOString() : null)
  }

  const handleOrderChange = () => {
    const value = !form.values.inAscendingOrder
    handleUrlParamChange('inAscendingOrder', value.toString())
  }

  const reset = () => {
    form.reset()
    router.push(`${pathname}`)
  }

  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <>
      <form>
        <Stack ml={isMobile ? Theme.spacing?.xs : 0} mr={isMobile ? Theme.spacing?.xs : 0}>
          <Grid align="flex-end">
            <Grid.Col span="auto">
              <Select
                label="Ordenar por"
                placeholder='Ej: "nombre"'
                data={[{ value: '', label: '' }].concat(
                  props.sortAttributes.map((attr) => ({
                    value: attr.attribute,
                    label: attr.displayName,
                  }))
                )}
                clearable
                value={form.values.sortBy}
                onChange={handleSortByChange}
              />
            </Grid.Col>
            <Grid.Col span={1}>
              <ActionIcon variant="transparent" onClick={handleOrderChange}>
                {form.values.inAscendingOrder ? <IconArrowUp /> : <IconArrowDown />}
              </ActionIcon>
            </Grid.Col>
          </Grid>

          <Select
            label="Universidad"
            placeholder='Ej: "UTN"'
            data={[{ value: '', label: '' }].concat(
              props.institutions.map((attr) => ({
                value: attr.attribute,
                label: attr.displayName,
              }))
            )}
            clearable
            value={form.values.university}
            onChange={handleUniversityChange}
          />

          <Select
            label="Regional"
            placeholder='Ej: "Regional Buenos Aires"'
            data={[{ value: '', label: '' }].concat(
              props.facilities.map((attr) => ({
                value: attr.attribute,
                label: attr.displayName,
              }))
            )}
            clearable
            value={form.values.facility}
            onChange={handleFacilityChange}
          />

          <Select
            label="Departamento"
            placeholder='Ej: "Ingeniería En Sistemas"'
            data={[{ value: '', label: '' }].concat(
              props.departments.map((attr) => ({
                value: attr.attribute,
                label: attr.displayName,
              }))
            )}
            clearable
            value={form.values.department}
            onChange={handleDepartmentChange}
          />

          <Select
            label="Usuario"
            placeholder='Ej: "Juan Perez"'
            data={[{ value: '', label: '' }].concat(
              props.users.map((attr) => ({
                value: attr.attribute,
                label: attr.displayName,
              }))
            )}
            clearable
            value={form.values.user}
            onChange={handleUserChange}
          />

          <MultiSelect
            label="Intereses"
            placeholder={form.values.interests.length === 0 ? 'Ej: "Inteligencia Artificial"' : ''}
            data={[{ value: '', label: '' }].concat(
              props.interests.map((attr) => ({
                value: attr.attribute,
                label: attr.displayName,
              }))
            )}
            clearable
            value={form.values.interests}
            onChange={handleInterestsChange}
          />

          <Select
            label="Tipo"
            placeholder='Ej: "Formal"'
            data={['', 'Formal', 'No Formal']}
            clearable
            value={form.values.type}
            onChange={handleTypeChange}
          />

          <Switch
            label="Descontinuados"
            mt={Theme.spacing?.xs}
            mb={Theme.spacing?.xs}
            checked={form.values.isDown}
            onChange={handleIsDownChange}
          />

          <DateInput
            label="Creados desde"
            clearable
            placeholder='Ej: "Febrero 15, 2024"'
            value={form.values.dateFrom}
            onChange={handleDateInputChange}
          />

          <Group grow mt={Theme.spacing?.sm}>
            <ActionIcon color="red" onClick={reset}>
              <IconTrash />
            </ActionIcon>
          </Group>
        </Stack>
      </form>
    </>
  )
}

export default ProjectFilterContent
