import React from 'react'
import { ActionIcon, Burger, Group } from '@mantine/core'
import { IconSunMoon } from '@tabler/icons-react'

import Theme from 'src/app/theme'
import SearchBar from '@/components/Common/SearchBar/SearchBar'

interface HeaderProps {
  opened: boolean
  toggle: () => void
  toggleColorScheme: () => void
}

const Header = (props: HeaderProps) => {
  return (
    <>
      <Group ml={15} h="100%" px="md" gap={20}>
        <Burger opened={props.opened} onClick={props.toggle} hiddenFrom="sm" size="sm" />
        <ActionIcon
          variant="filled"
          color={Theme.colors?.orange?.[4]}
          aria-label="Toggle dark/light theme"
          onClick={props.toggleColorScheme}>
          <IconSunMoon style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
        <SearchBar endpoint="projects" />
      </Group>
    </>
  )
}

export default Header
