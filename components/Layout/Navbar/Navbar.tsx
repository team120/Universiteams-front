import React from 'react'
import { AppShell, Divider, ScrollArea } from '@mantine/core'
import NavbarItem from './NavbarItem'
import {
  IconAlertCircle,
  IconBuildingCommunity,
  IconFileDescription,
  IconHome,
  IconShare,
  IconStar,
  IconTerminal2,
  IconUserCircle,
} from '@tabler/icons-react'

const mockUser = {
  name: 'Adriandrés Mecaduy',
  email: 'ttads120@gmail.com',
}

const mockAppVersion = 'v1.0.0'

// Icon properties
const iconSize = 40

const Navbar = () => {
  return (
    <>
      <AppShell.Section>
        <NavbarItem
          text={mockUser.name}
          textSecondLine={mockUser.email}
          icon={<IconUserCircle size={iconSize} />}
        />
      </AppShell.Section>
      <Divider />
      <AppShell.Section>
        <NavbarItem text="UPM Feed" icon={<IconHome size={iconSize} />} />
        <NavbarItem text="Mis Solicitudes" icon={<IconStar size={iconSize} />} />
      </AppShell.Section>
      <Divider />
      <AppShell.Section grow component={ScrollArea}>
        <NavbarItem text="Sobre Nosotros" icon={<IconBuildingCommunity size={iconSize} />} />
        <NavbarItem text="Términos y Condiciones" icon={<IconFileDescription size={iconSize} />} />
        <NavbarItem text="Compartir Aplicación" icon={<IconShare size={iconSize} />} />
        <NavbarItem text="Reportar un Bug" icon={<IconAlertCircle size={iconSize} />} />
      </AppShell.Section>
      <Divider />
      <AppShell.Section>
        <NavbarItem
          text={`Universiteams ${mockAppVersion}`}
          icon={<IconTerminal2 size={30} />}
          small
        />
      </AppShell.Section>
    </>
  )
}

export default Navbar
