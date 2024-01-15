import { Group, Button, Select, Stack } from '@mantine/core'
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
        <Group>
          <Select
            label="Ordenar por"
            data={props.sortAttributes.map((attr) => ({
              value: attr.attribute,
              label: attr.displayName,
            }))}
            {...form.getInputProps('sortBy')}
          />
          <Button onClick={toggleOrder}>
            {sortAscending ? <IconArrowUp /> : <IconArrowDown />}
          </Button>
        </Group>

        <DateInput label="Creados desde" {...form.getInputProps('dateFrom')} />

        <Stack>
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
