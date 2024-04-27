import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader, Card, Text, Button, Alert, Anchor, Box, Center } from '@mantine/core'
import axios from 'axios'
import Theme from '../../src/app/theme'
import { useMediaQuery } from '@mantine/hooks'
import { IconAlertCircle, IconArrowLeft, IconInfoCircle } from '@tabler/icons-react'

const VerifyEmail = () => {
  const router = useRouter()
  const query = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const verifyEmail = async () => {
      const token = query.get('token') as string
      const url = `http://api.localhost/auth/verify-email`
      try {
        const response = await axios.post(
          url,
          { verificationToken: token },
          { withCredentials: true }
        )
        if (response.status === 200) {
          setIsSuccess(true)
        }
      } catch (error) {
        console.error(error)
      }
      setIsLoading(false)
    }
    verifyEmail()
  }, [query.get('token')])

  const handleGoHomeClick = () => {
    router.push('/')
  }

  if (isLoading) return <Loader />

  return (
    <div>
      {isSuccess ? (
        <Alert color="green" title="Success" mb="xs" icon={<IconInfoCircle />}>
          <Text size="lg" style={{ weight: 500 }} mb="xs">
            ¡Correo electrónico verificado con éxito!
          </Text>
        </Alert>
      ) : (
        <Alert color="red" title="Error" mb="xs" icon={<IconAlertCircle />}>
          <Text size="lg" style={{ weight: 500 }} mb="xs">
            No se pudo verificar el correo electrónico
          </Text>
        </Alert>
      )}
      <Anchor size="md" onClick={handleGoHomeClick}>
        <Center inline>
          <IconArrowLeft stroke={1.5} />
          <Box ml={5}>Volver a la página de inicio</Box>
        </Center>
      </Anchor>
    </div>
  )
}

export default VerifyEmail
