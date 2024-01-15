import { Button, Select, Stack, Grid } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { IconArrowUp, IconArrowDown, IconCheck, IconTrash } from '@tabler/icons-react'
import SelectItem from '../Common/SelectItem'
import { useForm } from '@mantine/form'
import { useState } from 'react'

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

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
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
              <Button onClick={toggleOrder}>
                {sortAscending ? <IconArrowUp /> : <IconArrowDown />}
              </Button>
            </Grid.Col>
          </Grid>

          <DateInput label="Creados desde" {...form.getInputProps('dateFrom')} />

          <Button color="blue">
            <IconCheck />
            Aplicar
          </Button>
          <Button color="red" onClick={reset}>
            <IconTrash />
            Limpiar
          </Button>
        </Stack>
      </form>
    </>
  )
}

export default ProjectFilterContent
