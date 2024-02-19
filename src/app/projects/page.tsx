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
import { Facilities } from '@/services/facilities'
import { ResearchDepartments } from '@/services/departments'

const ProjectsPage: NextPage = () => {
  const [projectsResult, setProjectsResult] = useState<ProjectsResult>()
  const [institutions, setInstitutions] = useState<SelectItem[]>()
  const [facility, setFacilities] = useState<SelectItem[]>()
  const [departments, setDepartments] = useState<SelectItem[]>()

  const sortAttributes: SelectItem[] = [
    { attribute: 'name', displayName: 'nombre' },
    { attribute: 'facility', displayName: 'regional' },
    { attribute: 'creationDate', displayName: 'fecha creación' },
    { attribute: 'researchDepartment', displayName: 'departamento' },
  ]

  const searchQuery = useSearchParams()

  const getFacilities = async (institutionId: number) => {
    const facilities = await Facilities.GetFacilities({ institutionId: institutionId })
    const facilitiesSelectItems: SelectItem[] = []

    if (facilities) {
      facilities.forEach((facility) => {
        facilitiesSelectItems.push({
          attribute: facility.id.toString(),
          displayName: facility.name,
        } as SelectItem)
      })
      setFacilities(facilitiesSelectItems)
    }
  }

  const getDepartments = async (facilityId: number) => {
    const departments = await ResearchDepartments.GetResearchDepartments({ facilityId: facilityId })
    const departmentsSelectItems: SelectItem[] = []

    if (departments) {
      departments.forEach((department) => {
        departmentsSelectItems.push({
          attribute: department.id.toString(),
          displayName: department.name,
        } as SelectItem)
      })
      setDepartments(departmentsSelectItems)
    }
  }

  const getInstitutions = async () => {
    const institutions = await Institutions.GetInstitutions()
    const institutionsSelectItems: SelectItem[] = []

    if (institutions) {
      institutions.forEach((institution) => {
        institutionsSelectItems.push({
          attribute: institution.id.toString(),
          displayName: institution.name,
        } as SelectItem)
      })
      setInstitutions(institutionsSelectItems)
    }
  }

  useEffect(() => {
    const selectedInstitution = searchQuery.get('university')
    const selectedFacility = searchQuery.get('facility')

    Promise.all([
      getInstitutions(),
      selectedInstitution ? getFacilities(parseInt(selectedInstitution)) : Promise.resolve(),
      selectedFacility ? getDepartments(parseInt(selectedFacility)) : Promise.resolve(),
    ])
  }, [searchQuery])

  const getProjects = async (params: GetProjectsInput) => {
    const result = await Projects.GetProjects(params)
    setProjectsResult(result)
  }

  useEffect(() => {
    getProjects({
      generalSearchTerm: searchQuery.get('generalSearch') || undefined,
      institutionId: searchQuery.get('university')
        ? parseInt(searchQuery.get('university')?.split('|')[0]!)
        : undefined,
      facilityId: searchQuery.get('facility') ? parseInt(searchQuery.get('facility')?.split('|')[0]!) : undefined,
      researchDepartmentId: searchQuery.get('department')
        ? parseInt(searchQuery.get('department')?.split('|')[0]!)
        : undefined,
      interestIds: searchQuery.getAll('interestIds').map((id) => parseInt(id)),
      userId: searchQuery.get('user') ? parseInt(searchQuery.get('user')?.split('|')[0]!) : undefined,
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
      <Filter
        content={
          <ProjectFilterContent
            sortAttributes={sortAttributes}
            institutions={institutions ?? []}
            facilities={facility ?? []}
            departments={departments ?? []}
          />
        }>
        <ProjectsList projects={projectsResult?.projects} />
      </Filter>
    </>
  )
}

export default ProjectsPage
