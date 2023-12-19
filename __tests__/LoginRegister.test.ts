import { getPasswordStrength, getStrengthColorAndPhrase } from "../service/password"

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
    strength | phrase                        | percentage | color
    ${0}     | ${'Sucks'}                    | ${20}      | ${'red'}
    ${11}    | ${'Sucks'}                    | ${20}      | ${'red'}
    ${25}    | ${'My grandma can hack this'} | ${40}      | ${'orange'}
    ${48}    | ${'Still not close yet'}      | ${60}      | ${'yellow'}
    ${79}    | ${'Fair enough'}              | ${80}      | ${'blue'}
    ${81}    | ${'Bullet proof'}             | ${100}     | ${'green'}
    ${100}   | ${'Bullet proof'}             | ${100}     | ${'green'}
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
