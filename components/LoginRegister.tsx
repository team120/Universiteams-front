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

const LoginRegister: React.FC = () => {
    const emailRegex = /^\S+@\S+$/
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },

        validate: {
            email: (value) => (emailRegex.test(value) ? null : 'Invalid email'),
            password: (value) =>
                passwordRegex.test(value)
                    ? null
                    : 'Minimum eight characters, at least one letter and one number',
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
                Do not have an account yet?{' '}
                <Anchor<'a'> href="#" size="sm" onClick={(event) => event.preventDefault()}>
                    Create account
                </Anchor>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={form.onSubmit((values) => console.log(values))}>
                    <TextInput
                        label="Email"
                        placeholder="you@mantine.dev"
                        required
                        {...form.getInputProps('email')}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        required
                        mt="md"
                        {...form.getInputProps('password')}
                    />
                    <Group position="apart" mt="md">
                        <Checkbox label="Remember me" />
                        <Anchor<'a'> onClick={(event) => event.preventDefault()} href="#" size="sm">
                            Forgot password?
                        </Anchor>
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
