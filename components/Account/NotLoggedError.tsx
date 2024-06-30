import React from 'react'
import { useRouter } from 'next/navigation'

interface LoginErrorMessageProps {
  action: string
}

export const NotLoggedError = (props: LoginErrorMessageProps) => {
  const router = useRouter()

  return (
    <>
      Inicia sesión o crea una cuenta para {props.action}.{' '}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault()
          router.push('/account/login')
        }}>
        Iniciar sesión
      </a>
    </>
  )
}
