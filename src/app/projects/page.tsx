'use client'
import React, { useState, useEffect } from 'react'
import { NextPage } from 'next'

import { Projects } from '@/services/projects'
import ProjectsResult from '@/entities/ProjectsResult'
import SelectItem from '@/entities/CommonTypes/SelectItem'

import Filter from '@/components/Filter'
import ProjectFilterContent from '@/components/Project/ProjectFilterContent'
import ProjectsList from '@/components/Project/ProjectsList'

const ProjectsPage: NextPage = () => {
  const [projectsResult, setProjectsResult] = useState<ProjectsResult>()

  const sortAttributes: SelectItem[] = [
    { attribute: 'name', displayName: 'name' },
    { attribute: 'facility', displayName: 'facility' },
    { attribute: 'creationDate', displayName: 'creationDate' },
    { attribute: 'researchDepartment', displayName: 'researchDepartment' },
  ]

  const getProjects = async () => {
    const result = await Projects.GetProjects()
    if (!result) {
      setProjectsResult(undefined)
      return
    }
    setProjectsResult(result)
  }

  useEffect(() => {
    getProjects()
  }, [])

  return (
    <>
      <Filter content={<ProjectFilterContent sortAttributes={sortAttributes} />}>
        <ProjectsList projects={projectsResult?.projects} />
      </Filter>
    </>
  )
}

export default ProjectsPage
