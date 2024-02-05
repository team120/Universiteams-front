import React, { Suspense } from 'react'
import { List } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

import Theme from 'src/app/theme'
import Project from '@/entities/Project'
import ProjectItem from './ProjectItem'
import SkeletonFull from '../Loader/SkeletonFull'
import InfoMessage from '../Common/InfoMessage/InfoMessage'

interface ProjectsListProps {
  projects?: Project[]
}

const ProjectsList = ({ projects }: ProjectsListProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)')

  if (projects === undefined) return <SkeletonFull />
  if (projects.length == 0) return <InfoMessage text="Aún no tienes projectos" type="info" />

  return (
    <Suspense fallback={<SkeletonFull />}>
      <List ml={!isMobile ? Theme.spacing?.xs : 0}>
        {projects.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </List>
    </Suspense>
  )
}

export default ProjectsList
