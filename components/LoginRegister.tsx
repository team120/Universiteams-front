import React, { useEffect, useState } from 'react'
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
    Progress,
    Text,
    TextInput,
    Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useToggle } from '@mantine/hooks'
import { useRouter } from 'next/router'
import axios, { AxiosError } from 'axios'
import { Check, X } from 'tabler-icons-react'

const requirements = [
    { validate: (password: string) => password.length >= 8, label: 'Has at least 8 characters' },
    { validate: (password: string) => /[0-9]/.test(password), label: 'Includes number' },
    { validate: (password: string) => /[a-z]/.test(password), label: 'Includes lowercase letter' },
    { validate: (password: string) => /[A-Z]/.test(password), label: 'Includes uppercase letter' },
    {
        validate: (password: string) => /\W/.test(password),
        label: 'Includes special symbol',
    },
]

export const getPasswordStrength = (password: string) => {
    let strengthAccumulator = 0

    requirements.forEach((requirement) => {
        if (requirement.validate(password)) strengthAccumulator++
    })

    return strengthAccumulator * (100 / requirements.length)
}

export const getStrengthColorAndPhrase = (strength: number) => {
    const colors = ['red', 'yellow', 'orange', 'blue', 'green']
    const phrases = [
        'Sucks',
        'My grandma can hack this',
        'Still not close yet',
        'Fair enough',
        'Bullet proof',
    ]

    const colorAndPhraseByPercentage = requirements.map((undefined, index) => ({
        percentage: (index + 1) * (100 / requirements.length),
        color: colors[index],
        phrase: phrases[index],
    }))
    const strengthColorAndPhrase = colorAndPhraseByPercentage.filter(
        (e) => e.percentage >= strength
    )[0]

    return strengthColorAndPhrase
}

const Requirement = ({ meets, label }: { meets: boolean; label: string }) => {
    return (
        <Text color={meets ? 'teal' : 'red'} mt={5} size="sm">
            <Center inline>
                {meets ? <Check size={14} /> : <X size={14} />}
                <Box ml={7}>{label}</Box>
            </Center>
        </Text>
    )
}

const LoginRegister = ({ initialType }: { initialType: 'login' | 'register' }) => {
    const router = useRouter()
    const [type, toggleType] = useToggle(initialType, ['login', 'register'])
    const emailRegex = /^\S+@\S+$/
    const [serverErrors, setServerErrors] = useState<string[]>([])

    const handleSubmit = async (values: typeof form.values) => {
        const url = `http://api.localhost/auth/${type}`
        axios
            .post(url, values)
            .then(() => router.push('/'))
            .catch((error: AxiosError) => setServerErrors([error.response?.data.message]))
    }

    const validateName = (value: string) => {
        if (type !== 'register') return null
        if (value.length < 2) return 'Minimum two characters'

        return null
    }

    const form = useForm({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        },

        validate: {
            firstName: (value) => validateName(value),
            lastName: (value) => validateName(value),
            email: (value) => (emailRegex.test(value) ? null : 'Invalid email'),
            password: (value) => {
                if (type !== 'register') return null

                if (
                    getPasswordStrength(value) <
                    (requirements.length - 1) * (100 / requirements.length)
                )
                    return 'Password must follow at least 4 of the 5 contiguous guidelines'

                return null
            },
        },
    })

    useEffect(() => {
        setServerErrors([])
    }, [type])

    const strength = getPasswordStrength(form.values.password)
    const strengthColorAndPhrase = getStrengthColorAndPhrase(strength)

    const checks = requirements.map((requirement, index) => (
        <Requirement
            key={index}
            meets={requirement.validate(form.values.password)}
            label={requirement.label}
        />
    ))

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
                        <>
                            <Progress
                                mt="xs"
                                value={strength}
                                color={strengthColorAndPhrase?.color}
                            />
                            <Text size="sm" align="center" color={strengthColorAndPhrase?.color}>
                                {strengthColorAndPhrase?.phrase}
                            </Text>
                            {checks}
                        </>
                    )}

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
