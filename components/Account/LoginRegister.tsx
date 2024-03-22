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
  Center,
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
        const message = response?.message || 'Ocurrió un error inesperado'
        setServerErrors([message])
        return
      }

      setServerErrors([])
      router.push('/')
    } catch (error) {
      setServerErrors(['Ocurrió un error inesperado'])
    }
  }

  const validateName = (value: string) => {
    if (type !== 'register') return null
    if (value.length < 2) return 'Mínimo dos caracteres'

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
      email: (value) => (RegEx.email.test(value) ? null : 'Correo electrónico inválido'),
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
          ¡Bienvenido a Universiteams!
        </Title>
        <Text style={{ align: 'center' }} c={Theme.colors?.dimmed?.[6]} size="sm" mt={5}>
          {type === 'register' ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}{' '}
          <Anchor<'a'>
            href="#"
            size="sm"
            onClick={() => {
              toggleType()
              const route = type === 'register' ? '/Login' : '/Register'
              history.pushState(undefined, '', route)
            }}>
            {type === 'register' ? 'Iniciar sesión' : 'Registrarse'}
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
                label="Nombre"
                placeholder="Tu nombre"
                required
                {...form.getInputProps('firstName')}
              />
              <TextInput
                label="Apellido"
                placeholder="Tu apellido"
                required
                {...form.getInputProps('lastName')}
              />
            </>
          )}

          <TextInput
            label="Correo electrónico"
            placeholder="tu@correo.com"
            required
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Contraseña"
            placeholder="Tu contraseña"
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

          <Group justify="space-between" mt={Theme.spacing?.xs} mb={Theme.spacing?.xs}>
            <Center inline>
              <Checkbox />
              <Text size="sm" ml={5}>
                Recuérdame
              </Text>
            </Center>
            {type === 'login' && (
              <Anchor<'a'> onClick={handleForgotPasswordClick} href="#" size="sm">
                ¿Olvidaste tu contraseña?
              </Anchor>
            )}
          </Group>
          <Button fullWidth mt="xl" type="submit">
            {type === 'login' ? 'Iniciar sesión' : 'Registrarse'}
          </Button>
        </form>
      </Paper>
    </Container>
  )
}

export default LoginRegister
