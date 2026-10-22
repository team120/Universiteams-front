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

  it.each([
    ['accept', 'Aceptar invitación', 'acceptEnrollmentInvitation'],
    ['decline', 'Declinar invitación', 'declineEnrollmentInvitation'],
  ] as const)('should %s the invitation with the message', async (action, button, method) => {
    mockedProjects[method].mockResolvedValue()
    renderWithQueryClient(<EnrollmentInvitationAnswer projectId={1} action={action} />)

    await userEvent.type(screen.getByRole('textbox', { name: 'Mensaje' }), 'Gracias')
    await userEvent.click(screen.getByRole('button', { name: button }))

    expect(mockedProjects[method]).toHaveBeenCalledWith(1, { message: 'Gracias' })
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
