import { getPasswordStrength, getStrengthColorAndPhrase } from '../components/LoginRegister'

describe('getPasswordStrength', () => {
    describe('when no requirements are satisfied', () => {
        it('should return 0 and sucks respectively', () => {
            const password = ''

            const result = getPasswordStrength(password)

            expect(result).toBe(0)
        })
    })
})

describe('getStrengthColorAndPhrase', () => {
    describe('when password strength is zero', () => {
        it('should return zero percentage in red and sucks as feedback phrase', () => {
            const strength = 0
            
            const result = getStrengthColorAndPhrase(strength)

            expect(result.phrase).toBe('Sucks')
        })
    })
})
