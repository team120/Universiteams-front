import React, { Suspense } from 'react'
import { List } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import Theme from 'src/app/theme'

import InfoMessage from '../Common/InfoMessage/InfoMessage'
import SkeletonFull from '../Loader/SkeletonFull'
import User from '@/entities/User'
import UserItem from './UserItem'

interface UserListProps {
  //users?: UserInList[]
  users?: any // Fix type
}

const UsersList = ({ users }: UserListProps) => {
  const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)

  if (!users) return <SkeletonFull />
  if (users.length == 0) return <InfoMessage text="No hay usuarios para mostrar" type="info" />

  return (
    <Suspense fallback={<SkeletonFull />}>
      <List ml={!isMobile ? 'xs' : 0}>
        {Array.isArray(users) && users.map((user: User) => <UserItem key={user.id} user={user} />)}
      </List>
    </Suspense>
  )
}

export default UsersList
