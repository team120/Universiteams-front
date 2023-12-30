import {
  Card,
  Text,
  Badge,
  Divider,
  useMantineTheme,
  Group,
  Stack,
  List,
  Image,
  Button,
  Box,
} from '@mantine/core'

interface Institution {
  id: number
  name: string
  abbreviation: string
}

interface Facility {
  id: number
  name: string
  abbreviation: string
  institution: Institution
}

interface ResearchDepartment {
  id: number
  name: string
  abbreviation: string
  facility: Facility
}

interface Interest {
  id: number
  name: string
}

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
}

interface Enrollment {
  id: number
  role: string
  user: User
  project: Project
}

export interface Project {
  id: number
  name: string
  type: string
  userCount: number
  creationDate: string
  endDate: string
  isDown: boolean
  researchDepartments: ResearchDepartment[]
  interests: Interest[]
  enrollments: Enrollment[]
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
    <>
      <List>
        {projects.map((project) => (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Box style={{ display: 'flex', flexDirection: 'row' }}>
              <Image
                src='https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80'
                width={160}
                height={160}
                alt='project image'
                style={{ marginRight: theme.spacing.md }}
              />
              <div>
                <Card.Section>
                  <Text weight={500} style={{ fontSize: '1.25rem', lineHeight: '1.75rem' }}>
                    {project.name}
                  </Text>
                </Card.Section>

                <Group position="apart" mt="md" mb="xs">
                  <Text weight={500}>
                    {project.type}|{project.creationDate}
                  </Text>
                  <Badge color="pink" variant="light">
                    {project.researchDepartments[0].name}
                  </Badge>
                </Group>

                <Text size="sm" color="dimmed">
                  {/* Additional project information can go here */}
                </Text>

                <Button variant="light" color="blue" fullWidth mt="md" radius="md">
                  Book classic tour now
                </Button>
              </div>
            </Box>
          </Card>
        ))}
      </List>
    </>
  )
}

export default ProjectsList
