import { render } from '../test-utils'
import Home from 'src/app/page'

describe('Home page', () => {
  it('renders without crashing', () => {
    render(<Home />)
  })
})
