import React from 'react'
import Link from 'next/link'
import { Anchor, Badge, Button, Card, Group, Image, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import Env from 'utils/config/Env'
import Theme from 'src/app/theme'

const HelpManuals = () => {
  const isTablet = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)
  const isPhone = useMediaQuery(`(max-width: ${Theme.breakpoints?.sm})`)

  return (
    <Card
      id="universiteams-help"
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
        <Text size="xl">Manuales de usuario | Universiteams</Text>
        <Badge color="pink">Manuales de ayuda</Badge>
      </Group>

      <Text size="sm" c="dimmed">
        ¿Necesitas ayuda para utilizar esta plataforma? Aquí encontrarás manuales de usuario para
        aprender a utilizar Universiteams. Si tienes alguna duda, no dudes en contactar con el
        equipo de soporte técnico{' '}
        <Anchor
          href={`mailto:${Env.contactMail}`}
          target="_blank"
          underline="hover"
          style={{ color: '#fd7e14' }}>
          {Env.contactMail}
        </Anchor>
      </Text>

      <Button color="blue" mt="md" radius="md">
        <Link
          target="_blank"
          href="https://www.universiteams.com"
          style={{ color: 'inherit', textDecoration: 'inherit' }}>
          Manual de usuario visitante
        </Link>
      </Button>
      <Button color="blue" mt="md" radius="md">
        <Link
          target="_blank"
          href="https://www.universiteams.com"
          style={{ color: 'inherit', textDecoration: 'inherit' }}>
          Manual de usuario registrado
        </Link>
      </Button>
      <Button color="orange.6" mt="md" radius="md">
        <Link
          target="_blank"
          href="https://api.universiteams.com/Docs"
          style={{ color: 'inherit', textDecoration: 'inherit' }}>
          Manual de líder de proyecto
        </Link>
      </Button>
      <Button color="orange.6" mt="md" radius="md">
        <Link
          target="_blank"
          href="https://api.universiteams.com/Docs"
          style={{ color: 'inherit', textDecoration: 'inherit' }}>
          Manual de administrador de sistema
        </Link>
      </Button>
    </Card>
  )
}

export default HelpManuals
