import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader, Card, Text, Button } from '@mantine/core'
import axios from 'axios'
import Theme from '../../src/app/theme'

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
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
      <Card shadow="sm" padding="lg" radius="md">
        <Text size="lg" style={{ weight: 500 }}>
          {isSuccess
            ? '¡Correo electrónico verificado con éxito!'
            : 'No se pudo verificar el correo electrónico.'}
        </Text>
        <Button
          variant="outline"
          color={Theme.colors?.blue?.[6]}
          onClick={handleGoHomeClick}
          style={{ marginTop: '1rem' }}>
          Ir a la página de inicio
        </Button>
      </Card>
    </div>
  )
}

export default VerifyEmail
