import { render } from '../utils/tests'
import ProjectCreateUpdate from '@/components/Project/ProjectCreateUpdate'
import ProjectDetails from '@/components/Project/ProjectDetails'
import UserDetails from '@/components/User/UserDetails'
import ProjectDetailsPage from 'src/app/projects/[id]/page'
import ProjectEditPage from 'src/app/projects/[id]/edit/page'
import UserDetailsPage from 'src/app/users/[id]/page'

jest.mock('@/components/Project/ProjectDetails', () => jest.fn(() => null))
jest.mock('@/components/Project/ProjectCreateUpdate', () => jest.fn(() => null))
jest.mock('@/components/User/UserDetails', () => jest.fn(() => null))

// Query keys built from the id must match keys built from API ids, which are numbers
describe('Detail pages', () => {
  it('should pass the project id from the route as a number', () => {
    render(<ProjectDetailsPage params={{ id: '5' }} />)

    expect(ProjectDetails).toHaveBeenCalledWith({ id: 5 }, expect.anything())
  })

  it('should pass the project id to the edit form as a number', () => {
    render(<ProjectEditPage params={{ id: '5' }} />)

    expect(ProjectCreateUpdate).toHaveBeenCalledWith({ id: 5 }, expect.anything())
  })

  it('should pass the user id from the route as a number', () => {
    render(<UserDetailsPage params={{ id: '8' }} />)

    expect(UserDetails).toHaveBeenCalledWith({ id: 8 }, expect.anything())
  })
})
