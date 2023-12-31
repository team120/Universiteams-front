import React, { useState } from 'react'
import {
  createStyles,
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
} from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Requirement from './Requirement'

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: rem(26),
    fontWeight: 900,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  controls: {
    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column-reverse',
    },
  },

  control: {
    [theme.fn.smallerThan('xs')]: {
      width: '100%',
      textAlign: 'center',
    },
  },
}))

const ForgotPassword = () => {
  const { classes } = useStyles()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [serverErrors, setServerErrors] = useState<string[]>([])

  const handleGoBackToLoginClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    router.push('/Login')
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
          <Text size="sm" color="teal">
            Password reset email sent successfully!
          </Text>
          <CloseButton onClick={handleDismiss} style={{ marginLeft: '8px' }} />
        </div>
      )}
      <Title className={classes.title} align="center">
        Forgot your password?
      </Title>
      <Text c="dimmed" fz="sm" ta="center">
        Enter your email to get a reset link
      </Text>

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
          <Group position="apart" mt="lg" className={classes.controls}>
            <Anchor
              color="dimmed"
              size="sm"
              className={classes.control}
              onClick={handleGoBackToLoginClick}>
              <Center inline>
                <IconArrowLeft size={rem(12)} stroke={1.5} />
                <Box ml={5}>Back to the login page</Box>
              </Center>
            </Anchor>
            <Button className={classes.control} type="submit">
              Reset password
            </Button>
          </Group>
        </Paper>
      </form>
    </Container>
  )
}

export default ForgotPassword
