'use client'
import React from 'react'
import { Badge, Button, Card, Flex, Group, Image, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import Theme from '../theme'
import Link from 'next/link'

const About = () => {
  const isTablet = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)
  const isPhone = useMediaQuery(`(max-width: ${Theme.breakpoints?.sm})`)

  return (
    <>
      <Card
        shadow="sm"
        my="2rem"
        mx={isPhone ? '2rem' : isTablet ? '3rem' : '20%'}
        p="lg"
        radius="md"
        withBorder>
        <Card.Section p="1rem">
          <Image src="/universiteams_banner.png" alt="Universiteams banner" p="rem" radius="md" />
        </Card.Section>

        <Group justify="space-between" mt="md" mb="xs">
          <Text size="xl">Universiteams</Text>
          <Badge color="pink">Android/iOS/Web</Badge>
        </Group>

        <Text size="sm" c="dimmed">
          This project was thought in order to facilitate the creation, management and formalization
          of university research projects. Both students and teachers will be able to organize their
          projects, which will be visible to other students who may want to join the research team.
        </Text>
        <Text size="sm" mt="1rem" c="dimmed">
          It mainly consists of a web application, the main page will contain all the projects in
          order to make them known for everyone, and they will be accepting requests for those who
          want to get in.
        </Text>

        <Text size="sm" mt="1rem">
          <b>Our main purpose is to facilitate and promote scientific dissemination.</b>
        </Text>

        <Button color="blue" mt="md" radius="md">
          <Link
            target="_blank"
            href="https://www.universiteams.com"
            style={{ color: 'inherit', textDecoration: 'inherit' }}>
            Visit Universiteams.com
          </Link>
        </Button>
      </Card>

      <Card
        shadow="sm"
        my="4rem"
        mx={isPhone ? '2rem' : isTablet ? '3rem' : '20%'}
        p="lg"
        radius="md"
        withBorder>
        <Card.Section p="1rem">
          <Flex justify="center">
            <Image
              src="/team120.jpeg"
              h="200"
              w="auto"
              alt="Universiteams logo"
              p="rem"
              radius="md"
            />
          </Flex>
        </Card.Section>

        <Group justify="space-between" mt="md" mb="xs">
          <Text size="xl">Team 120</Text>
          <Badge color="pink">GitHub org</Badge>
        </Group>

        <Text size="sm" c="dimmed">
          We are a small GitHub organization made up of graduate students from the National
          Technological University (Argentina), eager to develop applications that we consider may
          be useful but do not yet exist.
        </Text>

        <Text size="sm" mt="1rem" c="dimmed">
          All our source code is publicly accessible and can be viewed online on GitHub. For
          Universiteams we have 2 code repositories: Universiteams (backend) and Universiteams-front
          (frontend).
        </Text>

        <Button color="blue" mt="md" radius="md">
          <Link
            target="_blank"
            href="https://github.com/team120"
            style={{ color: 'inherit', textDecoration: 'inherit' }}>
            Visit GitHub.com/Team120
          </Link>
        </Button>
        <Button color="orange.6" mt="md" radius="md">
          <Link
            target="_blank"
            href="https://github.com/team120/Universiteams"
            style={{ color: 'inherit', textDecoration: 'inherit' }}>
            Visit Universiteams backend repo
          </Link>
        </Button>
        <Button color="orange.6" mt="md" radius="md">
          <Link
            target="_blank"
            href="https://github.com/team120/Universiteams-front  "
            style={{ color: 'inherit', textDecoration: 'inherit' }}>
            Visit Universiteams frontend repo
          </Link>
        </Button>
      </Card>
    </>
  )
}

export default About
