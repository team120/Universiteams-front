import React from 'react'
import { Text, StyleSheet } from '@react-pdf/renderer'
import { Html } from 'react-pdf-html'

import PDF from '@/components/Common/PDF/PDF'

import Enrollment from '@/entities/Enrollment/Enrollment'
import Interest from '@/entities/Interest'
import Project from '@/entities/Project/Project'
import ResearchDepartment from '@/entities/ResearchDepartment'

const styles = StyleSheet.create({
  big: {
    fontSize: 24,
  },
  space: {
    marginTop: 16,
  },
})

interface ProjectPDFProps {
  project: Project
}

const ProjectPDF = (props: ProjectPDFProps) => {
  const project: Project = props.project

  return (
    <PDF>
      <Text style={styles.space}>Reporte de proyecto:</Text>
      <Text style={styles.big}>{project.name}</Text>
      <Text style={styles.space}>Descripción:</Text>
      <Html>{project.description.trim()}</Html>
      <Text style={styles.space}>Tipo: {project.type}</Text>
      {project.web && <Text>Web: {project.web}</Text>}
      {project.language && (
        <Text>Idioma: {project.language == 'spanish' ? 'Español' : 'Inglés'}</Text>
      )}
      <Text>Fecha creación: {project.creationDate}</Text>
      <Text>Cantidad de favoritos: {project.favoriteCount}</Text>
      {Array.isArray(project.interests) && project.interests.length > 0 && (
        <>
          <Text style={styles.space}>Intereses:</Text>
          {project.interests.map((interests: Interest) => (
            <Text key={interests.id}>-- {interests.name}</Text>
          ))}
        </>
      )}
      {Array.isArray(project.researchDepartments) && project.researchDepartments.length > 0 && (
        <>
          <Text style={styles.space}>Departamentos de investigación:</Text>
          {project.researchDepartments.map((department: ResearchDepartment) => (
            <Text key={department.id}>
              -- {department.name} | {department.facility.name} |{' '}
              {department.facility.institution.name}
            </Text>
          ))}
        </>
      )}
      {Array.isArray(project.enrollments) && project.enrollments.length > 0 && (
        <>
          <Text style={styles.space}>Miembros ({project.userCount}):</Text>
          {project.enrollments.map((enrollment: Enrollment) => (
            <Text key={enrollment.id}>
              -- {enrollment.user.firstName} {enrollment.user.lastName} ({enrollment.role})
            </Text>
          ))}
        </>
      )}
    </PDF>
  )
}

export default ProjectPDF
