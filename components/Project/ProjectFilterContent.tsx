import React from 'react'
import { Select, Stack, Grid, ActionIcon, Group } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { IconArrowUp, IconArrowDown, IconCheck, IconTrash } from '@tabler/icons-react'
import SelectItem from '../Common/SelectItem'
import { useForm } from '@mantine/form'
import { useState } from 'react'
import Theme from 'src/app/theme'
import { useMediaQuery } from '@mantine/hooks'

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

  const handleSubmit = (values: any) => console.log(values)
  const reset = () => form.reset()
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

          <DateInput label="Creados desde" {...form.getInputProps('dateFrom')} />

          <Group grow gap={Theme.spacing?.xs} mt={Theme.spacing?.sm}>
            <ActionIcon color="red" onClick={reset}>
              <IconTrash />
            </ActionIcon>
            <ActionIcon color="blue">
              <IconCheck />
            </ActionIcon>
          </Group>
        </Stack>
      </form>
    </>
  )
}

export default ProjectFilterContent
