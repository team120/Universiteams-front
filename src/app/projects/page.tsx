'use client'
import React, { useState, useEffect } from 'react'
import { NextPage } from 'next'

import { GetProjectsInput, Projects } from '@/services/projects'
import ProjectsResult from '@/entities/ProjectsResult'
import SelectItem from '@/entities/HelpTypes/SelectItem'

import Filter from '@/components/Filter'
import ProjectFilterContent from '@/components/Project/ProjectFilterContent'
import ProjectsList from '@/components/Project/ProjectsList'
import { useSearchParams } from 'next/navigation'
import { Institutions } from '@/services/institutions'

const ProjectsPage: NextPage = () => {
  const [projectsResult, setProjectsResult] = useState<ProjectsResult>()
  const [institutions, setInstitutions] = useState<SelectItem[]>()

  const sortAttributes: SelectItem[] = [
    { attribute: 'name', displayName: 'nombre' },
    { attribute: 'facility', displayName: 'regional' },
    { attribute: 'creationDate', displayName: 'fecha creación' },
    { attribute: 'researchDepartment', displayName: 'departamento' },
  ]

  const getInstitutions = async () => {
    const result = await Institutions.GetInstitutions()
    const mappedResult = result?.map((institution) => {
      return {
        attribute: institution.id.toString(),
        displayName: institution.name,
      } as SelectItem
    })
    setInstitutions(mappedResult)
  }

  useEffect(() => {
    getInstitutions()
  })

  const searchQuery = useSearchParams()

  const getProjects = async (params: GetProjectsInput) => {
    const result = await Projects.GetProjects(params)
    setProjectsResult(result)
  }

  useEffect(() => {
    getProjects({
      generalSearchTerm: searchQuery.get('generalSearch') || undefined,
      universityId: searchQuery.get('university')
        ? parseInt(searchQuery.get('university')!)
        : undefined,
      departmentId: searchQuery.get('department')
        ? parseInt(searchQuery.get('department')!)
        : undefined,
      type: searchQuery.get('type') || undefined,
      isDown:
        searchQuery.get('isDown') === 'true'
          ? true
          : searchQuery.get('isDown') === 'false'
          ? false
          : undefined,
      dateFrom: searchQuery.get('dateFrom') ? new Date(searchQuery.get('dateFrom')!) : undefined,
      sortBy: searchQuery.get('sortBy') || undefined,
      inAscendingOrder:
        searchQuery.get('inAscendingOrder') === 'true'
          ? true
          : searchQuery.get('inAscendingOrder') === 'false'
          ? false
          : undefined,
    })
  }, [searchQuery])

  return (
    <>
      <Filter content={<ProjectFilterContent sortAttributes={sortAttributes} institutions={institutions ?? []} />}>
        <ProjectsList projects={projectsResult?.projects} />
      </Filter>
    </>
  )
}

export default ProjectsPage