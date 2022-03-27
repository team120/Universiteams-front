import { AppShell, Burger, Header, MediaQuery, Navbar, useMantineTheme } from '@mantine/core'
import * as React from 'react'

const Layout = (props: any) => {
    const [opened, setOpened] = React.useState(false)
    const theme = useMantineTheme()

    return (
        <AppShell
            padding="md"
            navbarOffsetBreakpoint="sm"
            navbar={
                <Navbar
                    width={{ sm: 300, lg: 400 }}
                    height={500}
                    p="md"
                    hiddenBreakpoint="sm"
                    hidden={!opened}>
                    {/* Navbar content */}
                    Navbar
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
                </Header>
            }
            styles={(theme) => ({
                main: {
                    backgroundColor:
                        theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                },
            })}>
            {/* Your application here */}
            {props.children}
        </AppShell>
    )
}

export default Layout
