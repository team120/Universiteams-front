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
      <Group ml={15} h="100%" gap="xs">
        {props.showNavAndSearch && (
          <Burger opened={props.opened} onClick={props.toggle} hiddenFrom="sm" size="sm" />
        )}
        <ActionIcon
          variant="transparent"
          color="blue.4"
          onClick={() => router.push('/')}
          aria-label="Universiteams Icon">
          <img src="/favicon.ico" alt="Project favicon" style={{ width: '100%', height: '100%' }} />{' '}
        </ActionIcon>
        <ActionIcon
          variant="filled"
          color="orange.4"
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
