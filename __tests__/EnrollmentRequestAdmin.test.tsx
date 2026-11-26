import '@testing-library/jest-dom/extend-expect'
import { notifications } from '@mantine/notifications'
import { renderWithQueryClient, screen, userEvent, waitFor } from '../utils/tests'
import { EnrollmentRequestAdmin } from '@/components/Enrollment/Request/EnrollmentRequestAdmin'
import { EnrollmentRequestShow } from '@/entities/Enrollment/EnrollmentRequestShow'
import { Projects } from '@/services/projects'

jest.mock('@mantine/modals', () => ({ modals: { open: jest.fn(), closeAll: jest.fn() } }))
jest.mock('@mantine/notifications', () => ({ notifications: { show: jest.fn() } }))
jest.mock('@/components/Common/TextEditor/TextEditor', () =>
  require('../utils/tests/TextEditorMock')
)
jest.mock('@/services/projects', () => ({
  ...jest.requireActual('@/services/projects'),
  Projects: {
    approveEnrollmentRequest: jest.fn(),
    rejectEnrollmentRequest: jest.fn(),
  },
}))
const mockedProjects = Projects as jest.Mocked<typeof Projects>
const request: EnrollmentRequestShow = {
  id: 1,
  requesterMessage: 'Quiero participar',
  creationDate: '2026-01-01T00:00:00.000Z',
  user: {
    id: 7,
    firstName: 'Camila',
    lastName: 'Villa',
    email: 'user2@example.com',
    userAffiliations: [],
    interests: [],
    enrollments: [],
  },
}

describe('EnrollmentRequestAdmin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should notify with correctly accented Spanish when rejecting a request', async () => {
    mockedProjects.rejectEnrollmentRequest.mockResolvedValue()
    renderWithQueryClient(
      <EnrollmentRequestAdmin projectId={1} request={request} action="reject" />
    )

    await userEvent.click(screen.getByRole('button', { name: 'Rechazar solicitud' }))

    await waitFor(() =>
      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Solicitud de inscripción rechazada',
          message: 'El usuario será notificado de la decisión',
        })
      )
    )
  })
})
