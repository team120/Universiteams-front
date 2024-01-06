//////////// VALIDATION TOOLS ////////////
import RegEx from './RegEx'

const email = (value?: string): boolean | void => {
  if (!value) return
  return RegEx.email.test(value)
}

const password = (value?: string): boolean | void => {
  if (!value) return
  return RegEx.password.test(value)
}

const Validation = { email, password }
export default Validation
