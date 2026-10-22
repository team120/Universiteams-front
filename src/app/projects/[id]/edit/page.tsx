'use client'
import React from 'react'

import ProjectCreateUpdate from '@/components/Project/ProjectCreateUpdate'
import InfoMessage from '@/components/Common/InfoMessage/InfoMessage'

interface ProjectEditPageParams {
  // Route params are always strings
  params: { id: string }
}

const ProjectEditPage = ({ params }: ProjectEditPageParams) => {
  const id = Number(params.id)
  if (!(id > 0)) {
    return (
      <InfoMessage type="error" text="No se ha enviado un ID correcto de proyecto en esta ruta" />
    )
  }

  return <ProjectCreateUpdate id={id} />
}

export default ProjectEditPage
