'use client'
import { NextPage } from 'next'
import ProjectsList, { Project } from '../../../components/Project/ProjectsList'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Filter from '@/components/Filter'
import ProjectFilterContent from '@/components/Project/ProjectFilterContent'
import SelectItem from '@/components/Common/SelectItem'

interface ProjectsResult {
  projects: Project[]
  suggestedSearchTerms?: string[]
  projectCount: number
}

const Projects: NextPage = () => {
  const [projects, setProjects] = useState<Project[]>([])

  const sortAttributes: SelectItem[] = [
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

  return (
    <>
      <Filter content={<ProjectFilterContent sortAttributes={sortAttributes} />}>
        <ProjectsList projects={projects} />
      </Filter>
    </>
  )
}

export default Projects
