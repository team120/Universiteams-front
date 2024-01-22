import React, { FormEvent } from 'react'
import { Select, Stack, Grid, ActionIcon, Group, Autocomplete, Switch } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { IconArrowUp, IconArrowDown, IconCheck, IconTrash } from '@tabler/icons-react'
import SelectItem from '../Common/SelectItem'
import { useForm } from '@mantine/form'
import { useState } from 'react'
import Theme from 'src/app/theme'
import { useMediaQuery } from '@mantine/hooks'
import { usePathname, useRouter } from 'next/navigation'

interface ProjectFilterContentProps {
  sortAttributes: SelectItem[]
}

const ProjectFilterContent = (props: ProjectFilterContentProps) => {
  const [sortAscending, setSortAscending] = useState(true)

  const form = useForm({
    initialValues: {
      generalSearch: '',
      sortBy: '',
      university: '',
      department: '',
      type: '',
      isDown: false,
      dateFrom: null,
    },
  })

  const router = useRouter()
  const pathname = usePathname()

  const updateUrl = (values: typeof form.values) => {
    const query = getUrlSearchParams(values)
    router.push(`${pathname}?${query}`)
  }

  const handleSubmit = (
    values: typeof form.values,
    event: React.FormEvent<HTMLFormElement> | undefined
  ) => {
    event?.preventDefault()
    updateUrl(values)
    form.reset()
  }

  const reset = () => {
    form.reset()
  }

  const toggleOrder = () => setSortAscending(!sortAscending)

  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack ml={isMobile ? Theme.spacing?.xs : 0} mr={isMobile ? Theme.spacing?.xs : 0}>
          <Grid align="flex-end">
            <Grid.Col span="auto">
              <Select
                label="Ordenar por"
                data={props.sortAttributes.map((attr) => ({
                  value: attr.attribute,
                  label: attr.displayName,
                }))}
                {...form.getInputProps('sortBy')}
              />
            </Grid.Col>
            <Grid.Col span={1}>
              <ActionIcon variant="transparent" onClick={toggleOrder}>
                {sortAscending ? <IconArrowUp /> : <IconArrowDown />}
              </ActionIcon>
            </Grid.Col>
          </Grid>

          <Autocomplete
            label="Universidad"
            placeholder='Ej: "UTN"'
            data={['React', 'Angular', 'Vue', 'Svelte']}
            {...form.getInputProps('university')}
          />

          <Autocomplete
            label="Departamento"
            placeholder='Ej: "Ingeniería En Sistemas"'
            data={['React', 'Angular', 'Vue', 'Svelte']}
            {...form.getInputProps('department')}
          />

          <Select
            label="Tipo"
            placeholder='Ej: "Formal"'
            data={['React', 'Angular', 'Vue', 'Svelte']}
            {...form.getInputProps('type')}
          />

          <Switch
            label="Descontinuados"
            mt={Theme.spacing?.xs}
            mb={Theme.spacing?.xs}
            {...form.getInputProps('isDown')}
          />

          <DateInput label="Creados desde" {...form.getInputProps('dateFrom')} />

          <Group grow gap={Theme.spacing?.xs} mt={Theme.spacing?.sm}>
            <ActionIcon color="red" onClick={reset}>
              <IconTrash />
            </ActionIcon>
            <ActionIcon color="blue" type="submit">
              <IconCheck />
            </ActionIcon>
          </Group>
        </Stack>
      </form>
    </>
  )
}

export default ProjectFilterContent
function getUrlSearchParams(values: { [x: string]: any }) {
  // Remove keys with empty values
  Object.keys(values).forEach((key) => {
    if (!values[key]) {
      delete values[key]
    }
  })

  return new URLSearchParams(values as any).toString()
}
