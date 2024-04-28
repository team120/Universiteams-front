import { getPasswordStrength, getStrengthColorAndPhrase } from '@/services/password'

describe('getPasswordStrength', () => {
  describe('when no requirements are satisfied', () => {
    it.each`
      password           | strength
      ${''}              | ${0}
      ${'P'}             | ${20}
      ${'Pa'}            | ${40}
      ${'pA&'}           | ${60}
      ${'passas_asas'}   | ${60}
      ${'Passsword778'}  | ${80}
      ${'Passsword_778'} | ${100}
    `("when password is '$password' should return '$strength'", ({ password, strength }) => {
      const result = getPasswordStrength(password)

      expect(result).toBe(strength)
    })
  })
})

describe('getStrengthColorAndPhrase', () => {
  it.each`
    strength | phrase                     | percentage | color
    ${0}     | ${'Inadecuado'}            | ${20}      | ${'red.8'}
    ${11}    | ${'Inadecuado'}            | ${20}      | ${'red.8'}
    ${25}    | ${'Fácilmente Vulnerable'} | ${40}      | ${'orange.6'}
    ${48}    | ${'Aún No Suficiente'}     | ${60}      | ${'yellow.6'}
    ${79}    | ${'Aceptable'}             | ${80}      | ${'blue.6'}
    ${81}    | ${'Altamente Seguro'}      | ${100}     | ${'green.6'}
    ${100}   | ${'Altamente Seguro'}      | ${100}     | ${'green.6'}
  `(
    "when password strength is '$strength' should return '$percentage' as percentage in '$color' color and '$phrase' as feedback phrase",
    ({ strength, phrase, percentage, color }) => {
      const result = getStrengthColorAndPhrase(strength as number)

      expect(result.phrase).toBe(phrase)
      expect(result.percentage).toBe(percentage)
      expect(result.color).toBe(color)
    }
  )
})
