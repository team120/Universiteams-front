import React, { Suspense } from 'react'
import { Badge, Card, Chip, Group, Text, useMantineTheme } from '@mantine/core'
import Dates from 'utils/string/Dates'
import Project from '@/entities/Project'
import InfoMessage from '../Common/InfoMessage/InfoMessage'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ResearchDepartment from '@/entities/ResearchDepartment'
import User from '@/entities/User'
import Interest from '@/entities/Interest'

interface ProjectItemProps {
  project?: Project
}

const ProjectItem = (props: ProjectItemProps) => {
  const theme = useMantineTheme()
  const project = props.project

  const searchQuery = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const handleInterestChipClick = (interest: Interest) => {
    const currentUrlParams = new URLSearchParams(searchQuery.toString())
    currentUrlParams.set('interest', `${interest.id}|${interest.name}`)
    router.push(`${pathname}?${currentUrlParams.toString()}`)
  }

  const handleDepartmentBadgeClick = (department: ResearchDepartment) => {
    const currentUrlParams = new URLSearchParams(searchQuery.toString())
    currentUrlParams.set('department', `${department.id}|${department.name}`)
    router.push(`${pathname}?${currentUrlParams.toString()}`)
  }

  const handleLeaderChipClick = (user: User) => {
    const currentUrlParams = new URLSearchParams(searchQuery.toString())
    currentUrlParams.set('user', `${user.id}|${user.firstName} ${user.lastName}`)
    router.push(`${pathname}?${currentUrlParams.toString()}`)
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
                onClick={() => handleDepartmentBadgeClick(department)}>
                {department.name}
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
                onClick={() => handleLeaderChipClick(project.enrollments[0].user)}>
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
                onClick={() => handleInterestChipClick(interest)}>
                {interest.name}
              </Chip>
            ))}
          </Group>
        </Chip.Group>
      </div>
    </Card>
  )
}

export default ProjectItem
