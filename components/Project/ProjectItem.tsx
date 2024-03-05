import React from 'react'
import { ActionIcon, Badge, Card, Chip, Group, Text, useMantineTheme } from '@mantine/core'
import Dates from 'utils/string/Dates'
import Project from '@/entities/Project'
import InfoMessage from '../Common/InfoMessage/InfoMessage'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Url } from '@/services/url'
import { Projects } from '@/services/projects'
import { Bookmark } from 'tabler-icons-react'

interface ProjectItemProps {
  project?: Project
}

const ProjectItem = (props: ProjectItemProps) => {
  const theme = useMantineTheme()
  const project = props.project

  const searchQuery = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const handleInterestChipClick = (interestId: number) => {
    Url.appendToUrl(router, pathname, searchQuery, 'interest', [interestId.toString()])
  }

  const handleBookmarkClick = (projectId: number) => {
    Projects.Bookmark(projectId)
  }

  const handleDepartmentBadgeClick = (
    institutionId: number,
    facilityId: number,
    departmentId: number
  ) => {
    let modifiedSearchQuery = searchQuery
    modifiedSearchQuery = Url.setUrlParam(
      router,
      pathname,
      searchQuery,
      'university',
      institutionId.toString()
    )
    modifiedSearchQuery = Url.setUrlParam(
      router,
      pathname,
      modifiedSearchQuery,
      'facility',
      facilityId.toString()
    )
    modifiedSearchQuery = Url.setUrlParam(
      router,
      pathname,
      modifiedSearchQuery,
      'department',
      departmentId.toString()
    )
  }

  const handleLeaderChipClick = (userId: number) => {
    Url.setUrlParam(router, pathname, searchQuery, 'user', userId.toString())
  }

  // Small loader needed?
  if (!project) return <InfoMessage text="No se ha podido cargar el projecto" type="error" />

  return (
    <Card
      key={project.id}
      mx={'3%'}
      mb={'0.5rem'}
      p={'1rem'}
      radius="md"
      style={{
        position: 'relative', // This is necessary for absolute positioning of the child
        display: 'flex',
        flexDirection: 'row',
        width: '94%',
        borderStyle: 'solid',
        borderColor: 'gray',
      }}>
      <div style={{ width: '100%' }}>
        <Card.Section>
          <Text style={{ fontSize: '1.25rem', fontWeight: 500, lineHeight: '1.75rem' }}>
            {project.name}
          </Text>
          <Group gap={'1rem'} style={{ marginBottom: theme.spacing.xs }}>
            <Text style={{ fontWeight: 500 }}>
              {project.type} | {Dates.formatDate(project.creationDate)}
              {project.endDate ? ` - ${Dates.formatDate(project.endDate)}` : ''}
            </Text>
            {project.researchDepartments.map((department) => (
              <Badge
                key={department.id}
                color="pink"
                variant="light"
                component="button"
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  handleDepartmentBadgeClick(
                    department.facility.institution.id,
                    department.facility.id,
                    department.id
                  )
                }>
                {department.facility.institution.abbreviation} | {department.facility.abbreviation}{' '}
                | {department.name}
              </Badge>
            ))}
          </Group>
        </Card.Section>

        <Chip.Group>
          <Group gap={'0.5rem'} mt={'1rem'}>
            {project.enrollments && (
              <Chip
                variant="light"
                color="blue"
                size="md"
                onClick={() => handleLeaderChipClick(project.enrollments[0].user.id)}>
                {project.enrollments[0].user.firstName} {project.enrollments[0].user.lastName}, +
                {project.userCount} personas
              </Chip>
            )}
            {project.interests.map((interest) => (
              <Chip
                variant="light"
                key={interest.id}
                color="blue"
                size="md"
                onClick={() => handleInterestChipClick(interest.id)}>
                {interest.name}
              </Chip>
            ))}
          </Group>
        </Chip.Group>

        <ActionIcon
          variant="transparent"
          aria-label="Guardar en marcadores"
          onClick={() => handleBookmarkClick(project.id)}
          style={{
            position: 'absolute',
            top: '-0.2rem', // Adjust as needed
            right: '-0.2rem', // Adjust as needed
          }}>
          <Bookmark style={{width: '100%', height: '100%'}} />
        </ActionIcon>
      </div>
    </Card>
  )
}

export default ProjectItem
