import React from 'react'
import { AppShell, useComputedColorScheme, useMantineColorScheme } from '@mantine/core'
import { useDisclosure, useHotkeys } from '@mantine/hooks'

import Header from './Header/Header'
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
      navbar={{ width: { base: 270 }, breakpoint: 'sm', collapsed: { mobile: !opened } }}>
      <AppShell.Header>
        <Header opened={opened} toggle={toggle} toggleColorScheme={toggleColorScheme} />
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>{props.children}</AppShell.Main>
    </AppShell>
  )
}

export default Layout
