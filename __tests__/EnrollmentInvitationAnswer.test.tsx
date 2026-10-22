import '@testing-library/jest-dom/extend-expect'
import { notifications } from '@mantine/notifications'
import { renderWithQueryClient, screen, userEvent, waitFor } from '../utils/tests'
import { EnrollmentInvitationAnswer } from '@/components/Enrollment/Invitation/EnrollmentInvitationAnswer'
import { Projects } from '@/services/projects'

jest.mock('@mantine/modals', () => ({ modals: { open: jest.fn(), closeAll: jest.fn() } }))
jest.mock('@mantine/notifications', () => ({ notifications: { show: jest.fn() } }))
jest.mock('@/components/Common/TextEditor/TextEditor', () =>
  require('../utils/tests/TextEditorMock')
)
jest.mock('@/services/projects', () => ({
  ...jest.requireActual('@/services/projects'),
  Projects: {
    acceptEnrollmentInvitation: jest.fn(),
    declineEnrollmentInvitation: jest.fn(),
  },
}))
const mockedProjects = Projects as jest.Mocked<typeof Projects>

describe('EnrollmentInvitationAnswer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should accept the invitation without asking for a message nobody would read', async () => {
    mockedProjects.acceptEnrollmentInvitation.mockResolvedValue()
    renderWithQueryClient(<EnrollmentInvitationAnswer projectId={1} action="accept" />)

    expect(screen.queryByRole('textbox', { name: 'Mensaje' })).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: 'Aceptar invitación' }))

    expect(mockedProjects.acceptEnrollmentInvitation).toHaveBeenCalledWith(1, {})
  })

  it('should decline the invitation with the message', async () => {
    mockedProjects.declineEnrollmentInvitation.mockResolvedValue()
    renderWithQueryClient(<EnrollmentInvitationAnswer projectId={1} action="decline" />)

    await userEvent.type(screen.getByRole('textbox', { name: 'Mensaje' }), 'No puedo ahora')
    await userEvent.click(screen.getByRole('button', { name: 'Declinar invitación' }))

    expect(mockedProjects.declineEnrollmentInvitation).toHaveBeenCalledWith(1, {
      message: 'No puedo ahora',
    })
  })

  it('should show why the answer failed', async () => {
    mockedProjects.acceptEnrollmentInvitation.mockRejectedValue(
      Object.assign(new Error('Request failed with status code 400'), {
        response: { data: { message: 'No tienes una invitación pendiente para este proyecto' } },
      })
    )
    renderWithQueryClient(<EnrollmentInvitationAnswer projectId={1} action="accept" />)

    await userEvent.click(screen.getByRole('button', { name: 'Aceptar invitación' }))

    await waitFor(() =>
      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'No tienes una invitación pendiente para este proyecto',
          color: 'red',
        })
      )
    )
  })
})
