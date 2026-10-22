import axios from 'axios'
import { Projects } from '@/services/projects'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Projects invitation routes', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should list the invitations of a project', async () => {
    mockedAxios.get.mockResolvedValue({ data: { enrollmentInvitations: [] } })

    const result = await Projects.getEnrollmentInvitations(1)

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringMatching(/\/projects\/1\/invitations$/)
    )
    expect(result).toEqual({ enrollmentInvitations: [] })
  })

  it('should create, update and cancel an invitation under the project', async () => {
    await Projects.createEnrollmentInvitation(1, 8, { message: 'Hola' })
    await Projects.updateEnrollmentInvitation(1, 8, { message: 'Nuevo' })
    await Projects.cancelEnrollmentInvitation(1, 8)

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/projects\/1\/invitations\/8$/),
      { message: 'Hola' }
    )
    expect(mockedAxios.put).toHaveBeenCalledWith(
      expect.stringMatching(/\/projects\/1\/invitations\/8$/),
      { message: 'Nuevo' }
    )
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      expect.stringMatching(/\/projects\/1\/invitations\/8$/)
    )
  })

  it.each([
    ['accept', Projects.acceptEnrollmentInvitation],
    ['decline', Projects.declineEnrollmentInvitation],
  ])('should %s the current user invitation', async (action, answer) => {
    await answer(1, { message: 'Respuesta' })

    expect(mockedAxios.put).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`/projects/1/invitation/${action}$`)),
      { message: 'Respuesta' }
    )
  })
})
