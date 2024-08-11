'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { NextPage } from 'next'
import { useSearchParams } from 'next/navigation'
import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'
import { Center, Pagination } from '@mantine/core'

import { CurrentUserQueryOptions } from '@/services/currentUser'
import { Interests } from '@/services/interests'
import { GetUsersInput, Users } from '@/services/users'

import Filter from '@/components/Filter'
import UserFilterContent from '@/components/User/UserFilterContent'
import UserList from '@/components/User/UserList'
import { UserSortAttribute } from '@/entities/UserInList'

const UsersPage: NextPage = () => {
  const usersPerPage = 5
  const [currentPage, setCurrentPage] = useState(1)

  const { data: currentUser, error: errorCurrentUser } = useQuery(
    CurrentUserQueryOptions.currentUser()
  )

  const sortAttributes = useMemo(
    () => [
      { attribute: UserSortAttribute.FirstName, displayName: 'nombre' },
      { attribute: UserSortAttribute.LastName, displayName: 'apellido' },
    ],
    [errorCurrentUser, currentUser]
  )

  const searchQuery = useSearchParams()

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const usersQuery1 = useQuery({
    queryKey: ['users'],
    queryFn: (params: any) => Users.getUsers(params),
  })

  const userParams: GetUsersInput = {
    interestIds: searchQuery.getAll('interest').map((id: string) => +id),
    sortBy: searchQuery.get('sortBy') as UserSortAttribute | undefined,
    inAscendingOrder:
      searchQuery.get('inAscendingOrder') === 'true'
        ? true
        : searchQuery.get('inAscendingOrder') === 'false'
        ? false
        : undefined,
    offset: (currentPage - 1) * usersPerPage,
    limit: usersPerPage,
  }

  const usersQuery = useQuery(
    queryOptions({
      queryKey: ['users', userParams, currentPage, usersPerPage],
      queryFn: () => Users.getUsers(userParams),
      placeholderData: keepPreviousData,
    })
  )

  const interestsQuery = useQuery({
    queryKey: ['interests'],
    queryFn: Interests.getInterests,
  })

  const interests = useMemo(() => {
    if (interestsQuery.data) {
      return interestsQuery.data.map((interest) => ({
        attribute: interest.id.toString(),
        displayName: interest.name,
      }))
    }
    return []
  }, [interestsQuery.data])

  const totalPages = usersQuery?.data?.usersCount
    ? Math.ceil(usersQuery.data.usersCount / usersPerPage)
    : 1

  return (
    <>
      <Filter
        counter={usersQuery?.data?.usersCount ?? 0}
        content={<UserFilterContent sortAttributes={sortAttributes} interests={interests} />}>
        {<UserList users={usersQuery?.data?.users} />}
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

export default UsersPage
