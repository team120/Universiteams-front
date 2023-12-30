import { NextPage } from 'next'
import ProjectsList, { Project } from '../components/ProjectsList'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Grid } from '@mantine/core'

interface ProjectsResult {
  projects: Project[];
  suggestedSearchTerms?: string[];
  projectCount: number;
}

const Projects: NextPage = () => {
  const [projects, setProjects] = useState<Project[]>([])

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
    <Grid>
      <ProjectsList projects={projects} />
    </Grid>
  )
}

export default Projects
