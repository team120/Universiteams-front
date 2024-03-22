import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'

import RegEx from '../../utils/string/RegEx'
import {
  getPasswordStrength,
  getStrengthColorAndPhrase,
  passwordValidation,
  requirements,
} from '@/services/password'
import { Account } from '@/services/account'
import PasswordStrength from './PasswordStrength'

import Login from '@/entities/HelpTypes/Login'
import LoginRegisterType from '@/entities/HelpTypes/LoginRegisterType'

import {
  Anchor,
  Box,
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
import { useMediaQuery, useToggle } from '@mantine/hooks'
import Requirement from './Requirement'
import Theme from '../../src/app/theme'

interface LoginRegisterProps {
  initialType: LoginRegisterType
}

const LoginRegister = ({ initialType }: LoginRegisterProps) => {
  const router = useRouter()
  const [type, toggleType] = useToggle<LoginRegisterType>(['login', 'register'])
  const [serverErrors, setServerErrors] = useState<string[]>([])
  const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.md})`)

  const handleForgotPasswordClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    router.push('/account/forgotPassword')
  }

  const handleSubmit = async (values: Login) => {
    try {
      const response = await Account.Auth(values, type)
      if (response instanceof AxiosError) {
        const message = response?.message || 'An unexpected error occurred'
        setServerErrors([message])
        return
      }

      setServerErrors([])
      router.push('/')
    } catch (error) {
      setServerErrors(['An unexpected error occurred'])
    }
  }

  const validateName = (value: string) => {
    if (type !== 'register') return null
    if (value.length < 2) return 'Minimum two characters'

    return null
  }

  const form = useForm<Login>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },

    validate: {
      firstName: (value) => validateName(value),
      lastName: (value) => validateName(value),
      email: (value) => (RegEx.email.test(value) ? null : 'Invalid email'),
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
      <Box ml={isMobile ? Theme.spacing?.sm : 0}>
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
      </Box>

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
