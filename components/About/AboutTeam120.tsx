import React from 'react'
import Link from 'next/link'
import { Badge, Button, Card, Flex, Group, Image, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import Theme from 'src/app/theme'

const AboutUniversiteams = () => {
  const isTablet = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)
  const isPhone = useMediaQuery(`(max-width: ${Theme.breakpoints?.sm})`)

  return (
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
        Technological University (Argentina), eager to develop applications that we consider may be
        useful but do not yet exist.
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
  )
}

export default AboutUniversiteams
