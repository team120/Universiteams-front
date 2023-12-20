import { NextPage } from 'next'
import ProjectsList from '../components/ProjectsList'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Grid } from '@mantine/core'

const Register: NextPage = () => {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    axios
      .get('http://api.localhost/projects')
      .then((response) => {
        setProjects(response.data.projects)
        console.log(response.data.projects)
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

export default Register
