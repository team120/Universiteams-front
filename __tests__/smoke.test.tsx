import { render } from '@testing-library/react'
import Home from 'src/app/page'

describe('Home page', () => {
  it('renders without crashing', () => {
    render(<Home />)
  })
})
