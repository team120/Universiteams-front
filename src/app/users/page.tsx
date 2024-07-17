'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { NextPage } from 'next'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Center, Pagination } from '@mantine/core'

import { CurrentUserQueryOptions } from '@/services/currentUser'
import { Interests } from '@/services/interests'
import { Users } from '@/services/users'

import Filter from '@/components/Filter'
import User from '@/entities/User'
import UserFilterContent from '@/components/User/UserFilterContent'
import UserList from '@/components/User/UserList'
import { UserSortAttribute } from '@/entities/UserInList'

const UsersPage: NextPage = () => {
  const usersPerPage = 10
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

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => Users.getUsers,
  })

  const interestsQuery = useQuery({
    queryKey: ['interests'],
    queryFn: Interests.getInterests,
  })

  const users = useMemo(() => {
    if (Array.isArray(usersQuery.data)) {
      return usersQuery.data.map((user: User) => ({
        attribute: user.id.toString(),
        displayName: `${user.firstName} ${user.lastName}`,
      }))
    }
    return []
  }, [usersQuery.data])

  const interests = useMemo(() => {
    if (interestsQuery.data) {
      return interestsQuery.data.map((interest) => ({
        attribute: interest.id.toString(),
        displayName: interest.name,
      }))
    }
    return []
  }, [interestsQuery.data])

  const totalPages = Array.isArray(usersQuery?.data)
    ? Math.ceil(usersQuery.data.length / usersPerPage)
    : 1

  return (
    <>
      <Filter
        counter={0}
        content={<UserFilterContent sortAttributes={sortAttributes} interests={interests} />}>
        <UserList users={usersQuery.data} />
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
