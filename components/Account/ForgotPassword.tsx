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
        setServerErrors(['An unexpected error occurred'])
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
            Password reset email sent successfully!
          </Text>
          <CloseButton onClick={handleDismiss} style={{ marginLeft: '8px' }} />
        </div>
      )}
      <Stack align="center">
        <Title>Forgot your password?</Title>
        <Text c={Theme.colors?.dimmed?.[6]} fz="sm" ta="center">
          Enter your email to get a reset link
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
            label="Your email"
            placeholder="you@frro.utn.edu.ar"
            required
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
          <Stack align="flex-start" mt={Theme.spacing?.xs}>
            <Anchor c={Theme.colors?.dimmed?.[6]} size="sm" onClick={handleGoBackToLoginClick}>
              <Center inline>
                <IconArrowLeft stroke={1.5} />
                <Box ml={5}>Back to the login page</Box>
              </Center>
            </Anchor>
            <Button mt={Theme.spacing?.xs} type="submit">
              Reset password
            </Button>
          </Stack>
        </Paper>
      </form>
    </Container>
  )
}

export default ForgotPassword
