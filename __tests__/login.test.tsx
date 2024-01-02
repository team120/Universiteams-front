import { render, fireEvent } from '../test-utils'
import '@testing-library/jest-dom/extend-expect' // Import the matchers
import Login from 'src/app/account/login/page'

jest.mock('next/navigation', () => require('next-router-mock'))

describe('Login page', () => {
  it('moves to register form if login button is clicked', () => {
    const { getByText } = render(<Login />)
    const registerLink = getByText('Register')

    fireEvent.click(registerLink)
    const registerExtraField = getByText('First Name')
    expect(registerExtraField).toBeInTheDocument()
  })
})
