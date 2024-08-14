'use client'
import React from 'react'
import { useParams } from 'next/navigation'

import ProjectCreateUpdate from '@/components/Project/ProjectCreateUpdate'
import InfoMessage from '@/components/Common/InfoMessage/InfoMessage'

const ProjectEditPage = () => {
  const { id } = useParams<{ id: string }>()

  if (!id || +id == 0) {
    return (
      <InfoMessage type="error" text="No se ha enviado un ID correcto de proyecto en esta ruta" />
    )
  }

  return <ProjectCreateUpdate id={+id} />
}

export default ProjectEditPage
