import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import {
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Container,
  Anchor,
  Center,
  Box,
  CloseButton,
  Stack,
} from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import Requirement from './Requirement'
import { Account } from '@/services/account'

const ForgotPassword = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const { mutate: resetPassword, error } = useMutation({
    mutationFn: (email: string) => Account.forgotPassword(email),
    onSuccess: () => {
      setIsSuccess(true)
    },
  })

  const serverErrors = useMemo(() => {
    if (error instanceof AxiosError && error.response && error.response.status === 400) {
      return [error.response.data.message]
    } else if (error) {
      console.error(error)
      return ['Ocurrió un error inesperado']
    }
    return []
  }, [error])

  const handleGoBackToLoginClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    router.push('/account/login')
  }

  const handleDismiss = () => {
    setIsSuccess(false)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetPassword(email)
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
          <Text size="sm" c="teal.6">
            ¡Correo electrónico de restablecimiento de contraseña enviado con éxito!
          </Text>
          <CloseButton onClick={handleDismiss} style={{ marginLeft: '8px' }} />
        </div>
      )}
      <Stack align="center">
        <Title ta="center">¿Olvidaste tu contraseña?</Title>
        <Text c="dimmed.6" fz="sm" ta="center">
          Ingresa tu correo electrónico para obtener un enlace de restablecimiento
        </Text>
      </Stack>
      <form onSubmit={handleSubmit}>
        <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
          {serverErrors.length > 0 && (
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
          <Stack align="flex-start" mt="xs">
            <Anchor c="dimmed.6" size="sm" onClick={handleGoBackToLoginClick}>
              <Center inline>
                <IconArrowLeft stroke={1.5} />
                <Box ml={5}>Volver a la página de inicio de sesión</Box>
              </Center>
            </Anchor>
            <Button mt="xs" type="submit">
              Restablecer contraseña
            </Button>
          </Stack>
        </Paper>
      </form>
    </Container>
  )
}

export default ForgotPassword
