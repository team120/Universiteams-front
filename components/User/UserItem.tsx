import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Badge, Card, Chip, Flex, Group, Text, useMantineColorScheme } from '@mantine/core'
import styles from './UserItem.module.css'

import { CurrentUserQueryOptions } from '@/services/currentUser'
import { Url } from '@/services/url'

import InfoMessage from '../Common/InfoMessage/InfoMessage'
import User from '@/entities/User'
import { IconUser } from '@tabler/icons-react'

interface UserItemProps {
  user?: User
}

const UserItem = (props: UserItemProps) => {
  const user = props.user

  const searchQuery = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const { colorScheme } = useMantineColorScheme()

  const { data: currentUser, error: errorCurrentUser } = useQuery(
    CurrentUserQueryOptions.currentUser()
  )

  const handleInterestTagClick = (interestId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    Url.appendToUrl(router, pathname, searchQuery, 'interest', [interestId.toString()])
  }
  if (!user) return <InfoMessage text="No se ha podido cargar el usuario" type="error" />

  return (
    <Card
      key={user.id}
      mx="md"
      mb="0.5rem"
      p="md"
      radius="md"
      onClick={() => router.push(`/users/${user.id}`)}
      className={`${styles.card} ${colorScheme == 'dark' ? styles.cardDark : styles.cardLight}`}>
      <div style={{ width: '100%' }}>
        <Flex direction={'row'} align={'center'} gap={10}>
          <IconUser size={20} />
          <Text style={{ fontSize: '1.25rem', fontWeight: 500, lineHeight: '1.75rem' }}>
            {user.firstName} {user.lastName}
          </Text>
        </Flex>

        <Chip.Group>
          <Group gap={'0.5rem'} mt={'1rem'}>
            {user.interests.map((interest) => (
              <Badge
                variant="dot"
                key={interest.id}
                color="blue.6"
                size="lg"
                style={{ cursor: 'pointer' }}
                onClick={(event) => handleInterestTagClick(interest.id, event)}>
                {interest.name}
              </Badge>
            ))}
          </Group>
        </Chip.Group>
      </div>
    </Card>
  )
}

export default UserItem
