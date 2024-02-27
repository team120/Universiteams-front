import React, { useEffect, useState } from 'react'
import { ActionIcon, Drawer, Flex, Group } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconFilter, IconXboxX } from '@tabler/icons-react'
import Theme from 'src/app/theme'

interface FilterProps {
  children: React.ReactNode
  content: React.ReactNode
}

const Filter = (props: FilterProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    if (isMobile === true) {
      setOpened(false)
    } else {
      setOpened(true)
    }
  }, [isMobile])

  const toggle = () => {
    setOpened((prevOpened) => !prevOpened)
  }

  return (
    <>
      <Group justify={isMobile ? 'flex-end' : 'flex-start'}>
        <ActionIcon
          variant="transparent"
          aria-label="Filter"
          size="lg"
          onClick={() => toggle()}
          ml={Theme.spacing?.xs}
          mr={Theme.spacing?.xs}>
          <IconFilter style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      </Group>

      {isMobile && (
        <>
          <Drawer
            opened={opened}
            onClose={() => setOpened(false)}
            closeButtonProps={{
              icon: <IconXboxX size={20} />,
            }}
            padding="xl"
            size="100vw"
            position="right">
            {props.content}
          </Drawer>
          {props.children}
        </>
      )}

      {!isMobile && (
        <Flex direction="row-reverse">
          <div
            style={{
              width: opened ? '250px' : '0',
              padding: opened ? '1rem' : '0',
              overflow: 'hidden',
              transition: 'width 0.3s ease, padding 0.3s ease',
            }}>
            {opened && props.content}
          </div>
          <div style={{ flex: 1 }}>{props.children}</div>
        </Flex>
      )}
    </>
  )
}

export default Filter
