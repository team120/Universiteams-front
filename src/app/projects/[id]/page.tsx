'use client'
import React from 'react'
import ProjectDetails from '@/components/Project/ProjectDetails'

interface ProjectDetailsParams {
  // Route params are always strings
  params: { id: string }
}

const ProjectDetailsPage = ({ params }: ProjectDetailsParams) => {
  return <ProjectDetails id={Number(params.id)} />
}

export default ProjectDetailsPage
