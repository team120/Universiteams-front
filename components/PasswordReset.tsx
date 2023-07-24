import React, { useEffect, useState } from 'react'
import { Button, Text, Card, Loader } from '@mantine/core'
import { useForm } from '@mantine/form'
import axios from 'axios'
import { useRouter } from 'next/router'
import { PasswordInput } from '@mantine/core'
import {
    getPasswordStrength,
    getStrengthColorAndPhrase,
    passwordValidation,
    requirements,
} from '../service/password'
import PasswordStrength from './PasswordStrength'
import Requirement from './Requirement'

const parseJwt = (token: string) => {
    if (!token) {
        return
    }
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace('-', '+').replace('_', '/')
    return JSON.parse(window.atob(base64))
}

interface EmailTokenPayload {
    id: string
    email: string
    user: string
}

function PasswordReset() {
    const [serverErrors, setServerErrors] = useState<string[]>([])
    const [isSuccess, setIsSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [emailTokenPayload, setEmailTokenPayload] = useState<EmailTokenPayload | null>(null)
    const router = useRouter()

    useEffect(() => {
        const token = router.query.token as string
        if (token) {
            const decodedToken: EmailTokenPayload = parseJwt(token)
            setEmailTokenPayload(decodedToken)
        }
    }, [router.query.token])

    const validateConfirmPassword = (confirmPassword: string, password: string): string | null => {
        if (confirmPassword !== password) return 'Passwords do not match'

        return null
    }

    const form = useForm({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validate: {
            password: (value) => passwordValidation(value),
            confirmPassword: (value, values) => validateConfirmPassword(value, values.password),
        },
    })

    const handleSubmit = async (values: typeof form.values) => {
        setIsLoading(true)
        const url = 'http://api.localhost/auth/reset-password'
        const token = router.query.token as string
        try {
            const res = await axios.post(url, { ...values, verificationToken: token })
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
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoHomeClick = () => {
        router.push('/')
    }

    const strength = getPasswordStrength(form.values.password)
    const strengthColorAndPhrase = getStrengthColorAndPhrase(strength)

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}>
            {isLoading && <Loader />}
            {!isLoading && (
                <Card
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    style={{ maxWidth: '400px', width: '100%' }}>
                    <Text size="lg" weight={500} style={{ marginBottom: '1rem' }}>
                        {isSuccess ? 'Password reset successfully!' : `Change password for @${emailTokenPayload?.user}`}
                    </Text>
                    {isSuccess ? (
                        <Button variant="outline" color="blue" onClick={handleGoHomeClick}>
                            Go to home page
                        </Button>
                    ) : (
                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            {serverErrors.map((error, index) => (
                                <Requirement key={index} meets={false} label={error} />
                            ))}
                            <PasswordInput
                                required
                                label="New Password"
                                placeholder="Enter your new password"
                                {...form.getInputProps('password')}
                                style={{ marginBottom: '1rem' }}
                            />
                            {strength > 0 && (
                                <PasswordStrength
                                    strength={strength}
                                    phrase={strengthColorAndPhrase?.phrase}
                                    color={strengthColorAndPhrase?.color}
                                    requirements={requirements}
                                    formValue={form.values.password}
                                />
                            )}
                            <PasswordInput
                                required
                                label="Confirm Password"
                                placeholder="Confirm your new password"
                                {...form.getInputProps('confirmPassword')}
                                style={{ marginBottom: '1rem' }}
                            />
                            <Button type="submit" color="blue" style={{ marginTop: '1rem' }}>
                                Reset Password
                            </Button>
                        </form>
                    )}
                </Card>
            )}
        </div>
    )
}

export default PasswordReset
