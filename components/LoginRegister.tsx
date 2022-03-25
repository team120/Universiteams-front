import React from 'react'
import { Button, Card, Checkbox, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'

const LoginRegister = () => {
    const emailRegex = /^\S+@\S+$/
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            termsOfService: false,
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
        <Card m="lg" p="lg">
            <Card.Section
                p="lg"
                sx={(theme) => ({
                    color: theme.colors.blue,
                    background: theme.colors.dark[8],
                    textAlign: 'center',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                })}>
                UNIVERSITEAMS
            </Card.Section>
            <form onSubmit={form.onSubmit((values) => console.log(values))}>
                <TextInput
                    mt="md"
                    required
                    label="Email"
                    placeholder="your@email.com"
                    {...form.getInputProps('email')}
                />

                <TextInput
                    mt="md"
                    required
                    label="Password"
                    placeholder="********"
                    {...form.getInputProps('password')}
                />

                <Checkbox
                    mt="md"
                    label="I agree to the Universiteams terms and conditions"
                    {...form.getInputProps('termsOfService', { type: 'checkbox' })}
                />

                <Group position="right" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
            </form>
        </Card>
    )
}

export default LoginRegister
