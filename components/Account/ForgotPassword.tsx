import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import {
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Container,
  Group,
  Anchor,
  Center,
  Box,
  rem,
  CloseButton,
  Stack,
  Space,
} from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import Requirement from './Requirement'
import Theme from '../../src/app/theme'

const ForgotPassword = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [serverErrors, setServerErrors] = useState<string[]>([])

  const handleGoBackToLoginClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    router.push('/account/login')
  }

  const handleDismiss = () => {
    setIsSuccess(false)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const url = 'http://api.localhost/auth/forgot-password'
    try {
      const res = await axios.post(url, { email }, { withCredentials: true })
      if (res.status === 200) {
        setIsSuccess(true)
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setServerErrors([error.response.data.message])
      } else {
        console.error(error)
        setServerErrors(['Ocurrió un error inesperado'])
      }
    }
  }

  return (
    <Container size={460} my={30}>
      {isSuccess && (
        <div
          style={{
            backgroundColor: '#e6fffa',
            padding: '8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text size="sm" c={Theme.colors?.teal?.[6]}>
            ¡Correo electrónico de restablecimiento de contraseña enviado con éxito!
          </Text>
          <CloseButton onClick={handleDismiss} style={{ marginLeft: '8px' }} />
        </div>
      )}
      <Stack align="center">
        <Title>¿Olvidaste tu contraseña?</Title>
        <Text c={Theme.colors?.dimmed?.[6]} fz="sm" ta="center">
          Ingresa tu correo electrónico para obtener un enlace de restablecimiento
        </Text>
      </Stack>

      <form onSubmit={handleSubmit}>
        <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
          {serverErrors?.length > 0 && (
            <>
              {serverErrors.map((error, index) => (
                <Requirement key={index} meets={false} label={error} />
              ))}
            </>
          )}
          <TextInput
            label="Tu correo electrónico"
            placeholder="tu@frro.utn.edu.ar"
            required
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
          <Stack align="flex-start" mt={Theme.spacing?.xs}>
            <Anchor c={Theme.colors?.dimmed?.[6]} size="sm" onClick={handleGoBackToLoginClick}>
              <Center inline>
                <IconArrowLeft stroke={1.5} />
                <Box ml={5}>Volver a la página de inicio de sesión</Box>
              </Center>
            </Anchor>
            <Button mt={Theme.spacing?.xs} type="submit">
              Restablecer contraseña
            </Button>
          </Stack>
        </Paper>
      </form>
    </Container>
  )
}

export default ForgotPassword
