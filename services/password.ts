export interface IRequirement {
  validate: (password: string) => boolean
  label: string
}

export const requirements: IRequirement[] = [
  {
    validate: (password: string) => password.length >= 8,
    label: 'Tiene al menos 8 caracteres',
  },
  {
    validate: (password: string) => /[0-9]/.test(password),
    label: 'Incluye un número',
  },
  {
    validate: (password: string) => /[a-z]/.test(password),
    label: 'Incluye una letra minúscula',
  },
  {
    validate: (password: string) => /[A-Z]/.test(password),
    label: 'Incluye una letra mayúscula',
  },
  {
    validate: (password: string) => /[\W_]/.test(password),
    label: 'Incluye un símbolo especial',
  },
]

export const getPasswordStrength = (password: string) => {
  let strengthAccumulator = 0

  for (const requirement of requirements) {
    if (requirement.validate(password)) {
      strengthAccumulator++;
    }
  }

  return strengthAccumulator
}

export const getStrengthColorAndPhrase = (strength: number) => {
  const strengthPercentage = strength * (100 / requirements.length)
  const colors = ['red.8', 'orange.6', 'yellow.6', 'blue.6', 'green.6']
  const phrases = [
    'Inadecuado',
    'Fácilmente Vulnerable',
    'Aún No Suficiente',
    'Aceptable',
    'Altamente Seguro',
  ]

  const colorAndPhraseByPercentage = requirements.map((_, index) => ({
    percentage: (index + 1) * (100 / requirements.length),
    color: colors[index],
    phrase: phrases[index],
  }))
  const strengthColorAndPhrase = colorAndPhraseByPercentage.filter(
    (req) => req.percentage >= strengthPercentage
  )[0]

  return strengthColorAndPhrase
}

export const passwordValidation = (value: string): string | null => {
  const newLocal = getPasswordStrength(value)
  console.log('password strength', newLocal)
  if (newLocal < 3)
    return 'La contraseña debe cumplir al menos 4 de las 5 pautas contiguas'

  return null
}
