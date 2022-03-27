import { AppShell, Burger, Header, MediaQuery, Navbar, useMantineTheme } from '@mantine/core'
import * as React from 'react'
import HeaderContent from './HeaderContent'
import NavbarDouble from './NavbarDouble'
import FooterContent from './FooterContent'

const Layout = (props: any) => {
    const [opened, setOpened] = React.useState(false)
    const theme = useMantineTheme()

    return (
        <AppShell
            padding="md"
            navbarOffsetBreakpoint="sm"
            fixed
            navbar={
                <Navbar
                    width={{ sm: 300, lg: 400, base: 100 }}
                    p="md"
                    hiddenBreakpoint="sm"
                    hidden={!opened}>
                    {/* Navbar content */}
                    <NavbarDouble />
                </Navbar>
            }
            header={
                <Header height={70} p="md">
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((o) => !o)}
                                size="sm"
                                color={theme.colors.gray[6]}
                                mr="xl"
                            />
                        </MediaQuery>
                    </div>
                    <HeaderContent />
                </Header>
            }
            styles={(theme) => ({
                main: {
                    backgroundColor:
                        theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                },
            })}>
            {props.children}
            <FooterContent />
        </AppShell>
    )
}

export default Layout
