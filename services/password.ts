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

  requirements.forEach((requirement) => {
    if (requirement.validate(password)) strengthAccumulator++
  })

  return strengthAccumulator * (100 / requirements.length)
}

export const getStrengthColorAndPhrase = (strength: number) => {
  const colors = ['red', 'orange', 'yellow', 'blue', 'green']
  const phrases = [
    'Inadecuado',
    'Fácilmente Vulnerable',
    'Aún No Suficiente',
    'Aceptable',
    'Altamente Seguro',
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
    return 'La contraseña debe cumplir al menos 4 de las 5 pautas contiguas'

  return null
}
