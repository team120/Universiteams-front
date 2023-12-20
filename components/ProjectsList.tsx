import { Card, Text, Col, Badge, Divider, Grid, useMantineTheme, Group, Stack } from '@mantine/core'

interface Project {
  id: number
  name: string
  type: string
  userCount: number
  creationDate: string
  endDate: string
  isDown: boolean
}

interface ProjectsListProps {
  projects: Project[]
}

function ProjectsList({ projects }: ProjectsListProps) {
  const theme = useMantineTheme()

  const formatDate = (dateString: string | undefined) => {
    // A simple date formatter function to format the date strings
    return dateString ? new Date(dateString).toLocaleDateString() : 'N/A'
  }

  return (
    <Grid>
      {projects.map((project) => (
        <Grid.Col span={12} md={6} lg={4} key={project.id}>
          <Card
            padding="md"
            shadow="xs"
            style={{ marginBottom: theme.spacing.md, cursor: 'pointer' }}
            onMouseEnter={(event) => {
              event.currentTarget.style.boxShadow = theme.shadows.md
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.boxShadow = theme.shadows.xs
            }}>
            <Text weight={700} size="lg" style={{ marginBottom: theme.spacing.xs }}>
              {project.name}
            </Text>
            <Divider style={{ marginBottom: theme.spacing.md }} />
            <Stack spacing="xs">
              <Group position="apart" style={{ width: '100%' }}>
                <Text size="sm">Cantidad de usuarios:</Text>
                <Badge size="sm">{project.userCount}</Badge>
              </Group>
              <Group position="apart" style={{ width: '100%' }}>
                <Text size="sm">Fecha de creacion:</Text>
                <Text size="sm">{formatDate(project.creationDate)}</Text>
              </Group>
              <Group position="apart" style={{ width: '100%' }}>
                <Text size="sm">Fecha de fin:</Text>
                <Text size="sm">{formatDate(project.endDate)}</Text>
              </Group>
              <Group position="apart" style={{ width: '100%' }}>
                <Text size="sm">Esta activo:</Text>
                <Badge color={project.isDown ? 'red' : 'green'} variant="light">
                  {project.isDown ? 'Yes' : 'No'}
                </Badge>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  )
}

export default ProjectsList
