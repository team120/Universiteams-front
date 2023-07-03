import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect' // Import the matchers
import Login from '../pages/Login'

jest.mock('next/router', () => require('next-router-mock'))

describe('Login page', () => {
    it('moves to register form if login button is clicked', () => {
        const { getByText } = render(<Login />)
        const registerLink = getByText('Register')

        fireEvent.click(registerLink)
        const registerExtraField = getByText('First Name')
        expect(registerExtraField).toBeInTheDocument()
    })
})