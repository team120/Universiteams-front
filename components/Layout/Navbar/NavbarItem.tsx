import React from 'react'
import { Box, Container, Flex } from '@mantine/core'
import CustomLink from '@/components/Common/CustomLink/CustomLink'

interface INavbarItem {
  text: string
  textSecondLine?: string
  link?: string
  icon?: JSX.Element
  small?: boolean
}

const NavbarItem = (props: INavbarItem) => {
  const itemContent = () => {
    return (
      <Flex
        h={props.small ? 45 : 60}
        bg="var(--mantine-color-gray-light)"
        pl={20}
        align={'center'}
        gap={20}>
        {props.icon && props.icon}
        {props.textSecondLine ? (
          <Box>
            <Container>{props.text}</Container>
            <Container>{props.textSecondLine}</Container>
          </Box>
        ) : (
          <Box>
            <Container>{props.text}</Container>
          </Box>
        )}
      </Flex>
    )
  }

  return (
    <>{props.link ? <CustomLink link={props.link} content={itemContent()} /> : itemContent()}</>
  )
}

export default NavbarItem
