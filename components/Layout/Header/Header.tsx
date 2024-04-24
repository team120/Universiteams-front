import React from 'react'
import { ActionIcon, Burger, Center, Container, Group } from '@mantine/core'
import { IconSchool, IconSunMoon } from '@tabler/icons-react'

import Theme from 'src/app/theme'
import SearchBar from '@/components/Common/SearchBar/SearchBar'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  opened: boolean
  showNavAndSearch: boolean
  toggle: () => void
  toggleColorScheme: () => void
}

const Header = (props: HeaderProps) => {
  const router = useRouter()

  return (
    <>
      <Group ml={15} h="100%">
        {props.showNavAndSearch && (
          <Burger mr={15} opened={props.opened} onClick={props.toggle} hiddenFrom="sm" size="sm" />
        )}
        <ActionIcon
          variant="transparent"
          color={Theme.colors?.blue?.[4]}
          mr='xs'
          onClick={() => router.push('/')}
          aria-label="Universiteams Icon">
          <img src="/favicon.ico" alt="Project favicon" style={{ width: '100%', height: '100%' }} />{' '}
        </ActionIcon>
        <ActionIcon
          variant="filled"
          color={Theme.colors?.orange?.[4]}
          aria-label="Toggle dark/light theme"
          onClick={props.toggleColorScheme}>
          <IconSunMoon style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
        {props.showNavAndSearch && (
          <Container fluid>
            <Center>
              <SearchBar />
            </Center>
          </Container>
        )}
      </Group>
    </>
  )
}

export default Header
