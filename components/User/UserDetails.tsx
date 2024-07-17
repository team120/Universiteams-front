import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Badge, Card, Chip, Group, Text } from '@mantine/core'

import { CurrentUserQueryOptions } from '@/services/currentUser'
import { Users } from '@/services/users'

import SkeletonFull from '@/components/Loader/SkeletonFull'

interface UserDetailsParams {
  id: number
}

export enum UserDetailsTabs {
  Users = 'users',
}

const UserDetails = (props: UserDetailsParams) => {
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['users', props.id],
    queryFn: () => Users.getUser(props.id),
  })

  const queryClient = useQueryClient()

  const { data: currentUser, error: errorCurrentUser } = useQuery(
    CurrentUserQueryOptions.currentUser()
  )

  const {
    data: enrollmentRequests,
    error: errorEnrollmentRequests,
    isLoading: isLoadingEnrollmentRequests,
  } = useQuery({
    queryKey: ['enrollments', props.id],
    queryFn: () => Users.getEnrollmentRequests(props.id),
  })

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleInterestTagClick = (interestId: number) => {
    router.push(`/users?interest=${interestId}`)
  }

  if (isLoading) return <SkeletonFull />
  if (error) return <Alert color="red">{error.message}</Alert>
  if (!user) return <Alert color="red">No se encontró el usuario</Alert>

  return (
    <>
      <Card key={user.id} mx="md" mb="0.5rem" p="md" radius="md" withBorder>
        <Text style={{ fontSize: '1.25rem', fontWeight: 500, lineHeight: '1.75rem' }}>
          {user.firstName} {user.lastName}
        </Text>

        <Chip.Group>
          <Group gap={'0.5rem'} mt={'1rem'}>
            {user.interests.map((interest) => (
              <Badge
                variant="dot"
                key={interest.id}
                color="blue.6"
                size="lg"
                style={{ cursor: 'pointer' }}
                onClick={() => handleInterestTagClick(interest.id)}>
                {interest.name}
              </Badge>
            ))}
          </Group>
        </Chip.Group>

        {/* To-Do: Enrollments & more info */}
      </Card>
    </>
  )
}

export default UserDetails
