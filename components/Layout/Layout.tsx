import React from 'react'

import {
  AppShell,
  Burger,
  Group,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core'
import { useDisclosure, useHotkeys } from '@mantine/hooks'
import Navbar from './Navbar/Navbar'

interface Layout {
  children: React.ReactNode
  pageProps?: any
}

const Layout = (props: Layout) => {
  const [opened, { toggle }] = useDisclosure()

  // Change between theme preferences
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('dark')
  const toggleColorScheme = () => setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark')

  // Hotkeys
  useHotkeys([['mod+J', () => toggleColorScheme()]])

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: { sm: 300, lg: 400 }, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md">
      <AppShell.Header>
        <Group ml={10} h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>{props.children}</AppShell.Main>
    </AppShell>
  )
}

export default Layout
