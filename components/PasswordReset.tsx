import { useState } from 'react'
import { Button, Text, Card, Alert, useMantineTheme, Loader } from '@mantine/core'
import { useForm } from '@mantine/form'
import axios from 'axios'
import { useRouter } from 'next/router'
import { PasswordInput } from '@mantine/core'

function PasswordReset() {
    const [serverErrors, setServerErrors] = useState<string[]>([])
    const [isSuccess, setIsSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const theme = useMantineTheme()

    const form = useForm({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validate: {
            password: (value) => value.length >= 8 || 'Password must be at least 8 characters long',
            confirmPassword: (value, values) =>
                value === values.password || 'Passwords do not match',
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
                        {isSuccess ? 'Password reset successfully!' : 'Reset your password'}
                    </Text>
                    {isSuccess ? (
                        <Button variant="outline" color="blue" onClick={handleGoHomeClick}>
                            Go to home page
                        </Button>
                    ) : (
                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            {serverErrors.map((error, index) => (
                                <Alert
                                    key={index}
                                    color="red"
                                    style={{ marginBottom: '1rem' }}
                                    icon={<span style={{ color: theme.colors.red[6] }}>!</span>}>
                                    {error}
                                </Alert>
                            ))}
                            <PasswordInput
                                required
                                label="New Password"
                                placeholder="Enter your new password"
                                {...form.getInputProps('password')}
                                style={{ marginBottom: '1rem' }}
                            />
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
