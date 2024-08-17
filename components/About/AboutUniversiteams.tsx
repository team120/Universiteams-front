import React from 'react'
import Link from 'next/link'
import { Badge, Button, Card, Group, Image, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import Theme from 'src/app/theme'

const AboutUniversiteams = () => {
  const isTablet = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)
  const isPhone = useMediaQuery(`(max-width: ${Theme.breakpoints?.sm})`)

  return (
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
  )
}

export default AboutUniversiteams
