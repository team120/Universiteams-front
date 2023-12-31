import { NextPage } from 'next'
import ProjectsList, { Project } from '../components/ProjectsList'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Button, Drawer, Grid, Group, Select, Stack } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { IconArrowUp, IconArrowDown, IconCheck, IconTrash } from '@tabler/icons-react'
import { useForm } from '@mantine/form'

interface ProjectsResult {
  projects: Project[]
  suggestedSearchTerms?: string[]
  projectCount: number
}

const Projects: NextPage = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [isMobile, setIsMobile] = useState(false) // Adjust this according to your logic
  const [drawerOpened, setDrawerOpened] = useState(!isMobile)
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

  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerWidth = 250 // Set the width of the drawer

  const containerStyle = {
    display: 'flex',
    width: '100%',
    height: '100vh',
  }

  const drawerStyle = {
    width: drawerWidth,
    flexShrink: 0,
  }

  const mainContentStyle = {
    flexGrow: 1,
    transition: 'margin 0.3s',
    marginLeft: drawerOpen ? drawerWidth : 0,
    // Other styles as needed
  }

  return (
    <Grid>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Drawer
          opened={drawerOpened}
          onClose={() => setDrawerOpened(false)}
          size={drawerWidth}
          style={drawerStyle}
          position="right"
          padding="xl">
          <div style={mainContentStyle}>
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

            <Stack spacing="xs">
              <Button color="blue">
                <IconCheck />
                Aplicar
              </Button>
              <Button color="red" onClick={reset}>
                <IconTrash />
                Limpiar
              </Button>
            </Stack>
          </div>
        </Drawer>
      </form>
      <ProjectsList projects={projects} />
    </Grid>
  )
}

export default Projects
