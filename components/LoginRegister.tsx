import React from 'react'
import {
    Anchor,
    Button,
    Card,
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
import { useRouter } from 'next/router'

const LoginRegister: React.FC = () => {
    const [type, toggleType] = useToggle('login', ['login', 'register'])
    const router = useRouter()
    const emailRegex = /^\S+@\S+$/
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

    const form = useForm({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        },

        validate: {
            email: (value) => (emailRegex.test(value) ? null : 'Invalid email'),
            password: (value) => {
                if (type !== 'register') return null
                if (!passwordRegex.test(value))
                    return 'Minimum eight characters, at least one letter and one number'

                return null
            },
        },
    })

    return (
        <Container size={420} my={40}>
            <Title
                align="center"
                sx={(theme) => ({
                    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                    fontWeight: 900,
                })}>
                Welcome to Universiteams!
            </Title>
            <Text color="dimmed" size="sm" align="center" mt={5}>
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
                <form onSubmit={form.onSubmit((values) => console.log(values))}>
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
                    <Group position="apart" mt="md">
                        <Checkbox label="Remember me" />
                        {type === 'login' && (
                            <Anchor<'a'>
                                onClick={(event) => event.preventDefault()}
                                href="#"
                                size="sm">
                                Forgot password?
                            </Anchor>
                        )}
                    </Group>
                    <Button fullWidth mt="xl" type="submit">
                        Login
                    </Button>
                </form>
            </Paper>
        </Container>
    )
}

export default LoginRegister
