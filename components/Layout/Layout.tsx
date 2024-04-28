import React from 'react'
import { AppShell, useComputedColorScheme, useMantineColorScheme } from '@mantine/core'
import { useDisclosure, useHotkeys } from '@mantine/hooks'
import { usePathname } from 'next/navigation'

import Constants from '../../utils/string/Constants'
import Header from './Header/Header'
import Navbar from './Navbar/Navbar'

interface Layout {
  children: React.ReactNode
}

const Layout = (props: Layout) => {
  const [opened, { toggle }] = useDisclosure()
  const pathName = usePathname()

  // Change between theme preferences
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('dark')
  const toggleColorScheme = () => setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark')

  // Hotkeys
  useHotkeys([['mod+J', () => toggleColorScheme()]])

  // Validate pathname - Layout without navigation
  if (Constants.noAuthRoutes.includes(pathName)) {
    return (
      <AppShell header={{ height: 60 }}>
        <AppShell.Header>
          <Header
            opened={false}
            toggle={toggle}
            toggleColorScheme={toggleColorScheme}
            showNavAndSearch={false}
          />
        </AppShell.Header>
        <AppShell.Main>{props.children}</AppShell.Main>
      </AppShell>
    )
  }

  // Layout with navigation
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: { base: 270 }, breakpoint: 'sm', collapsed: { mobile: !opened } }}>
      <AppShell.Header>
        <Header
          opened={opened}
          toggle={toggle}
          toggleColorScheme={toggleColorScheme}
          showNavAndSearch={true}
        />
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>{props.children}</AppShell.Main>
    </AppShell>
  )
}

export default Layout
