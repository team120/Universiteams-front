import React, { useEffect, useState } from 'react'
import { AppShell, Divider, ScrollArea } from '@mantine/core'
import NavbarItem from './NavbarItem'
import {
  IconAlertCircle,
  IconBuildingCommunity,
  IconBulb,
  IconFileDescription,
  IconFolderBolt,
  IconFolderHeart,
  IconFolderQuestion,
  IconFolders,
  IconHome,
  IconQuestionMark,
  IconSend,
  IconShare,
  IconTerminal2,
  IconUserCircle,
} from '@tabler/icons-react'
import { CurrentUserInfo, CurrentUserService } from '../../../services/currentUser'
import { RequestState } from '../../../entities/Project'

const mockAppVersion = 'v1.0.0'

// Icon properties
const iconSize = 40

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUserInfo | null>(null)

  const fetchCurrentUser = async () => {
    const user = await CurrentUserService.fetchUserInfo()
    setCurrentUser(user)
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  return (
    <>
      {currentUser ? (
        <AppShell.Section>
          <NavbarItem
            text={currentUser.user}
            textSecondLine={currentUser.email}
            link="perfil"
            icon={<IconUserCircle size={iconSize} />}
          />
        </AppShell.Section>
      ) : (
        <AppShell.Section>
          <NavbarItem
            text="Iniciar Sesión"
            link="account/login"
            icon={<IconUserCircle size={iconSize} />}
          />
        </AppShell.Section>
      )}
      <Divider />
      <AppShell.Section>
        {currentUser && (
          <NavbarItem
            text="Mis Proyectos"
            link={`projects?requestState=${RequestState.Accepted}`}
            icon={<IconBulb size={iconSize} />}
          />
        )}
        {currentUser && (
          <NavbarItem
            text="Mis Solicitudes"
            link={`projects?requestState=${RequestState.Pending}`}
            icon={<IconSend size={iconSize} />}
          />
        )}
        <NavbarItem text="Proyectos" link="projects" icon={<IconFolders size={iconSize} />} />
        {currentUser && (
          <NavbarItem
            text="Proyectos Favoritos"
            link="projects?isFavorite=true"
            icon={<IconFolderHeart size={iconSize} />}
          />
        )}
      </AppShell.Section>
      <Divider />
      <AppShell.Section grow component={ScrollArea}>
        <NavbarItem
          text="Sobre Nosotros"
          link="about"
          icon={<IconBuildingCommunity size={iconSize} />}
        />
        <NavbarItem
          text="Términos y Condiciones"
          link="terminos"
          icon={<IconFileDescription size={iconSize} />}
        />
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
