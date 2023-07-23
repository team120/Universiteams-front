export const requirements = [
    {
        validate: (password: string) => password.length >= 8,
        label: 'Has at least 8 characters',
    },
    {
        validate: (password: string) => /[0-9]/.test(password),
        label: 'Includes number',
    },
    {
        validate: (password: string) => /[a-z]/.test(password),
        label: 'Includes lowercase letter',
    },
    {
        validate: (password: string) => /[A-Z]/.test(password),
        label: 'Includes uppercase letter',
    },
    {
        validate: (password: string) => /[\W_]/.test(password),
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
    const colors = ['red', 'orange', 'yellow', 'blue', 'green']
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

export const passwordValidation = (value: string): string | null => {
    if (getPasswordStrength(value) < 3)
        return 'Password must follow at least 4 of the 5 contiguous guidelines'

    return null
}
