import React from 'react'
import { Burger, Group } from '@mantine/core'

import SearchBar from '@/components/Common/SearchBar/SearchBar'

interface HeaderProps {
  opened: boolean
  toggle: () => void
}

const Header = (props: HeaderProps) => {
  return (
    <>
      <Group ml={15} h="100%" px="md" gap={20}>
        <Burger opened={props.opened} onClick={props.toggle} hiddenFrom="sm" size="sm" />
        <SearchBar endpoint="projects" />
      </Group>
    </>
  )
}

export default Header
