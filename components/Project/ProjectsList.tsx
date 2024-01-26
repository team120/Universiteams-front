import React from 'react'
import { Card, Text, Badge, useMantineTheme, Group, List, Chip } from '@mantine/core'
import Theme from 'src/app/theme'
import { useMediaQuery } from '@mantine/hooks'
import Project from '@/entities/Project'

interface ProjectsListProps {
  projects?: Project[]
}

function ProjectsList({ projects }: ProjectsListProps) {
  const theme = useMantineTheme()

  const formatDate = (dateString: string | undefined) => {
    // A simple date formatter function to format the date strings
    return dateString ? new Date(dateString).toLocaleDateString() : 'N/A'
  }

  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <>
      <List ml={!isMobile ? Theme.spacing?.xs : 0}>
        {(!projects || projects.length == 0) && <p>No hay projects</p>}
        {projects?.map((project) => (
          <Card
            key={project.id}
            padding="lg"
            radius="md"
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              borderStyle: 'solid',
              borderColor: 'gray',
            }}>
            <div style={{ width: '100%' }}>
              <Card.Section>
                <Text style={{ fontSize: '1.25rem', fontWeight: 500, lineHeight: '1.75rem' }}>
                  {project.name}
                </Text>
                <Group justify="space-between" style={{ marginBottom: theme.spacing.xs }}>
                  <Text style={{ fontWeight: 500 }}>
                    {project.type} | {formatDate(project.creationDate)}
                    {project.endDate ? ' - ' + formatDate(project.endDate) : ''}
                  </Text>
                  <Badge color="pink" variant="light">
                    {project.researchDepartments[0].name}
                  </Badge>
                </Group>
              </Card.Section>

              <Chip.Group>
                <Group style={{ marginTop: theme.spacing.xs }}>
                  {project.enrollments && (
                    <Chip variant="light" color="blue" size="md">
                      {project.enrollments[0].user.firstName} {project.enrollments[0].user.lastName}
                      , +{project.userCount} personas
                    </Chip>
                  )}
                  {project.interests.map((interest) => (
                    <Chip variant="light" key={interest.id} color="blue" size="md">
                      {interest.name}
                    </Chip>
                  ))}
                </Group>
              </Chip.Group>
            </div>
          </Card>
        ))}
      </List>
    </>
  )
}

export default ProjectsList
