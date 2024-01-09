'use client'
import { NextPage } from 'next'
import ProjectsList, { Project } from '../../../components/ProjectsList'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Button, Drawer, Group, Select, Stack } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import { IconArrowUp, IconArrowDown, IconCheck, IconTrash } from '@tabler/icons-react'
import { DateInput } from '@mantine/dates'

interface ProjectsResult {
  projects: Project[]
  suggestedSearchTerms?: string[]
  projectCount: number
}

const Projects: NextPage = () => {
  const [projects, setProjects] = useState<Project[]>([])
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

  const onSubmit = (values: any) => console.log(values)
  const reset = () => form.reset()
  const toggleOrder = () => setSortAscending(!sortAscending)

  const formatDate = (dateString: string | undefined) => {
    // A simple date formatter function to format the date strings
    return dateString ? new Date(dateString).toLocaleDateString() : 'N/A'
  }

  const sortAttributes: { attribute: string; displayName: string }[] = [
    { attribute: 'name', displayName: 'name' },
    { attribute: 'facility', displayName: 'facility' },
    { attribute: 'creationDate', displayName: 'creationDate' },
    { attribute: 'researchDepartment', displayName: 'researchDepartment' },
  ]

  useEffect(() => {
    axios
      .get<ProjectsResult>('http://api.localhost/projects')
      .then((response) => {
        setProjects(response.data.projects)
      })
      .catch((error) => {
        console.error('Error fetching data: ', error)
      })
  }, [])

  const toggle = () => {
    setOpened((prevOpened) => !prevOpened)
  }

  const [opened, setOpened] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const sidebarWidth = '250px'
  const headerHeight = '60px'

  return (
    <>
      <div>
        <Button onClick={() => toggle()}>Open sidebar</Button>

        <Drawer
          opened={opened}
          onClose={() => setOpened(false)}
          padding="xl"
          size={sidebarWidth}
          position="right"
          withOverlay={false}>
          <Group>
            <Select
              label="Ordenar por"
              data={sortAttributes.map((attr) => ({
                value: attr.attribute,
                label: attr.displayName,
              }))}
              {...form.getInputProps('sortBy')}
            />
            <Button onClick={toggleOrder}>
              {sortAscending ? <IconArrowUp /> : <IconArrowDown />}
            </Button>
          </Group>

          {/* Other filters similar to sortBy... */}

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
        </Drawer>

        <div
          style={{
            flex: 1,
            transform: opened ? `translateX(-${sidebarWidth})` : 'none',
            transition: 'transform 0.3s ease',
            marginLeft: opened ? sidebarWidth : '0',
          }}>
          <ProjectsList projects={projects} />
        </div>
      </div>
    </>
  )
}

export default Projects
