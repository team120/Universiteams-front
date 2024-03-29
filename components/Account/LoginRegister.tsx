import React, { useEffect, useState } from 'react'
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useToggle } from '@mantine/hooks'
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import Requirement from './Requirement'
import {
  getPasswordStrength,
  getStrengthColorAndPhrase,
  passwordValidation,
  requirements,
} from '@/services/password'
import PasswordStrength from './PasswordStrength'
import Theme from '../../src/app/theme'

interface ErrorResponse {
  message: string
}

const LoginRegister = ({ initialType }: { initialType: 'login' | 'register' }) => {
  const router = useRouter()
  const [type, toggleType] = useToggle(['login', 'register'])
  const emailRegex = /^\S+@\S+$/
  const [serverErrors, setServerErrors] = useState<string[]>([])

  const handleForgotPasswordClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    router.push('/forgot-password')
  }

  const handleSubmit = async (values: typeof form.values) => {
    const url = `http://api.localhost/auth/${type}`
    axios
      .post(url, values, { withCredentials: true })
      .then(() => router.push('/'))
      .catch((error: AxiosError<ErrorResponse>) => {
        const message = error.response?.data?.message || 'An unexpected error occurred'
        setServerErrors([message])
      })
  }

  const validateName = (value: string) => {
    if (type !== 'register') return null
    if (value.length < 2) return 'Minimum two characters'

    return null
  }

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },

    validate: {
      firstName: (value) => validateName(value),
      lastName: (value) => validateName(value),
      email: (value) => (emailRegex.test(value) ? null : 'Invalid email'),
      password: (value) => {
        if (type !== 'register') return null

        return passwordValidation(value)
      },
    },
  })

  useEffect(() => {
    setServerErrors([])
  }, [type])

  const strength = getPasswordStrength(form.values.password)
  const strengthColorAndPhrase = getStrengthColorAndPhrase(strength)

  return (
    <Container size={420} my={40}>
      <Title
        style={{
          align: 'center',
          fontFamily: 'Greycliff CF, sans-serif',
          fontWeight: 900,
        }}>
        Welcome to Universiteams!
      </Title>
      <Text style={{ align: 'center' }} c={Theme.colors?.dimmed?.[6]} size="sm" mt={5}>
        {type === 'register' ? 'Already have an account?' : "Don't have an account?"}{' '}
        <Anchor<'a'>
          href="#"
          size="sm"
          onClick={() => {
            toggleType()
            const route = type === 'register' ? '/Login' : '/Register'
            history.pushState(undefined, '', route)
          }}>
          {type === 'register' ? 'Login' : 'Register'}
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {serverErrors.map((error, index) => (
          <Requirement key={index} meets={false} label={error} />
        ))}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          {type === 'register' && (
            <>
              <TextInput
                label="First Name"
                placeholder="Your first name"
                required
                {...form.getInputProps('firstName')}
              />
              <TextInput
                label="Last Name"
                placeholder="Your last name"
                required
                {...form.getInputProps('lastName')}
              />
            </>
          )}

          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="xs"
            {...form.getInputProps('password')}
          />
          {type === 'register' && strength > 0 && (
            <PasswordStrength
              strength={strength}
              phrase={strengthColorAndPhrase?.phrase}
              color={strengthColorAndPhrase?.color}
              requirements={requirements}
              formValue={form.values.password}
            />
          )}

          <Group style={{ position: 'relative' }} mt="md">
            <Checkbox label="Remember me" />
            {type === 'login' && (
              <Anchor<'a'> onClick={handleForgotPasswordClick} href="#" size="sm">
                Forgot password?
              </Anchor>
            )}
          </Group>
          <Button fullWidth mt="xl" type="submit">
            {type === 'login' ? 'Login' : 'Register'}
          </Button>
        </form>
      </Paper>
    </Container>
  )
}

export default LoginRegister
