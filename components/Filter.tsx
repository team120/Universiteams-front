import { useState } from 'react'
import { ActionIcon, Drawer, Flex, Group } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { Filter as FilterIcon } from 'tabler-icons-react'
import Theme from 'src/app/theme'

interface FilterProps {
  children: React.ReactNode
  content: React.ReactNode
}

const Filter = (props: FilterProps) => {
  const toggle = () => {
    setOpened((prevOpened) => !prevOpened)
  }

  const [opened, setOpened] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const sidebarWidth = '250px'

  return (
    <>
      <ActionIcon
        variant="filled"
        aria-label="Filter"
        onClick={() => toggle()}
        ml={Theme.spacing?.xs}>
        <FilterIcon style={{ width: '70%', height: '70%' }} />
      </ActionIcon>

      {isMobile && (
        <>
          <Drawer
            opened={opened}
            onClose={() => setOpened(false)}
            padding="xl"
            size={sidebarWidth}
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
              width: opened ? sidebarWidth : '0',
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
