'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { NextPage } from 'next'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Alert, Center, Pagination } from '@mantine/core'

import { CurrentUserQueryOptions } from '@/services/currentUser'
import { DepartmentsQueryKey, ResearchDepartments } from '@/services/departments'
import { Facilities, FacilitiesQueryKey } from '@/services/facilities'
import { Institutions, InstitutionQueryKey } from '@/services/institutions'
import { InterestQueryKey, Interests } from '@/services/interests'
import { ProjectQueryOptions } from '@/services/projects'

import Filter from '@/components/Common/Filter/Filter'
import { Order } from '@/entities/HelpTypes/Order'
import ProjectFilterContent from '@/components/Project/ProjectFilterContent'
import ProjectsList from '@/components/Project/ProjectsList'
import { ProjectSortAttribute, RequestState } from '@/entities/Project/ProjectInList'

const ProjectsPage: NextPage = () => {
  const projectsPerPage = 5
  const [currentPage, setCurrentPage] = useState(1)

  const { data: currentUser, error: errorCurrentUser } = useQuery(
    CurrentUserQueryOptions.currentUser()
  )

  const sortAttributes = useMemo(
    () => [
      { value: ProjectSortAttribute.Name, label: 'nombre' },
      { value: ProjectSortAttribute.CreationDate, label: 'fecha creación' },
      ...(errorCurrentUser === null && currentUser !== undefined
        ? [{ value: ProjectSortAttribute.RequestEnrollmentCount, label: 'solicitudes' }]
        : []),
    ],
    [errorCurrentUser, currentUser]
  )

  const searchQuery = useSearchParams()

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const facilitiesQuery = useQuery({
    queryKey: [FacilitiesQueryKey, searchQuery.get('university')],
    queryFn: () =>
      Facilities.getFacilities({ institutionId: parseInt(searchQuery.get('university')!) }),
    enabled: !!searchQuery.get('university'),
  })

  const departmentsQuery = useQuery({
    queryKey: [DepartmentsQueryKey, searchQuery.get('facility')],
    queryFn: () =>
      ResearchDepartments.getResearchDepartments({
        facilityId: parseInt(searchQuery.get('facility')!),
      }),
    enabled: !!searchQuery.get('facility'),
  })

  const institutionsQuery = useQuery({
    queryKey: [InstitutionQueryKey],
    queryFn: Institutions.getInstitutions,
  })

  const interestsQuery = useQuery({
    queryKey: [InterestQueryKey],
    queryFn: Interests.getInterests,
  })

  const projectsQuery = useQuery(
    ProjectQueryOptions.projects(currentPage, projectsPerPage, {
      generalSearchTerm: searchQuery.get('generalSearch') || undefined,
      institutionId: searchQuery.get('university')
        ? parseInt(searchQuery.get('university')!)
        : undefined,
      facilityId: searchQuery.get('facility') ? parseInt(searchQuery.get('facility')!) : undefined,
      researchDepartmentId: searchQuery.get('department')
        ? parseInt(searchQuery.get('department')!)
        : undefined,
      interestIds: searchQuery.getAll('interest').map((id) => parseInt(id)),
      userId: searchQuery.get('user') ? parseInt(searchQuery.get('user')!) : undefined,
      type: searchQuery.get('type') || undefined,
      requestStates: searchQuery.getAll('requestState').map((state) => state as RequestState),
      isDown:
        searchQuery.get('isDown') === 'true'
          ? true
          : searchQuery.get('isDown') === 'false'
          ? false
          : undefined,
      isFavorite:
        searchQuery.get('isFavorite') === undefined
          ? undefined
          : searchQuery.get('isFavorite') === 'true',
      dateFrom: searchQuery.get('dateFrom') ? new Date(searchQuery.get('dateFrom')!) : undefined,
      sortBy: (searchQuery.get('sortBy') as ProjectSortAttribute) || undefined,
      order: (searchQuery.get('order') as Order) || undefined,
      offset: (currentPage - 1) * projectsPerPage,
      limit: projectsPerPage,
    })
  )

  const facilities = useMemo(() => {
    if (facilitiesQuery.data) {
      return facilitiesQuery.data.map((facility) => ({
        value: facility.id.toString(),
        label: facility.name,
      }))
    }
    return []
  }, [facilitiesQuery.data])

  const departments = useMemo(() => {
    if (departmentsQuery.data) {
      return departmentsQuery.data.map((department) => ({
        value: department.id.toString(),
        label: department.name,
      }))
    }
    return []
  }, [departmentsQuery.data])

  const institutions = useMemo(() => {
    if (institutionsQuery.data) {
      return institutionsQuery.data.map((institution) => ({
        value: institution.id.toString(),
        label: institution.name,
      }))
    }
    return []
  }, [institutionsQuery.data])

  const interests = useMemo(() => {
    if (interestsQuery.data) {
      return interestsQuery.data.map((interest) => ({
        value: interest.id.toString(),
        label: interest.name,
      }))
    }
    return []
  }, [interestsQuery.data])

  // A failed request must not leave the previous results on screen
  const projects = projectsQuery.isError ? undefined : projectsQuery.data

  const totalPages = projects?.projectCount ? Math.ceil(projects.projectCount / projectsPerPage) : 1

  return (
    <>
      <Filter
        counter={projects?.projectCount ?? 0}
        newButtonDirection="/projects/new"
        content={
          <ProjectFilterContent
            sortAttributes={sortAttributes}
            institutions={institutions}
            facilities={facilities}
            departments={departments}
            interests={interests}
          />
        }>
        {projectsQuery.isError ? (
          <Alert color="red" title="No se pudieron cargar los proyectos">
            Revisa la búsqueda (debe tener al menos 3 caracteres) e inténtalo de nuevo.
          </Alert>
        ) : (
          <ProjectsList projects={projects?.projects} />
        )}
        {totalPages > 1 && (
          <Center>
            <Pagination
              value={currentPage}
              total={totalPages}
              onChange={(page) => {
                setCurrentPage(page)
              }}
            />
          </Center>
        )}
      </Filter>
    </>
  )
}

export default ProjectsPage
