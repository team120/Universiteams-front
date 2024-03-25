import { render, fireEvent } from '../utils/tests'
import '@testing-library/jest-dom/extend-expect' // Import the matchers
import Login from 'src/app/account/login/page'

jest.mock('next/navigation', () => require('next-router-mock'))

describe('Login page', () => {
  it('moves to register form if login button is clicked', () => {
    const { getByText } = render(<Login />)
    const registerLink = getByText('Registrarse')

    fireEvent.click(registerLink)
    const registerExtraField = getByText('Nombre')
    expect(registerExtraField).toBeInTheDocument()
  })
})
