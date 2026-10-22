import '@testing-library/jest-dom/extend-expect'
import { modals } from '@mantine/modals'
import { renderWithQueryClient, screen, userEvent, waitFor, within } from '../utils/tests'
import { EnrollmentInvitationList } from '@/components/Enrollment/Invitation/EnrollmentInvitationList'
import { Projects } from '@/services/projects'
import { EnrollmentInvitationShow } from '@/entities/Enrollment/EnrollmentInvitationShow'
import { RequestState } from '@/entities/Project/ProjectInList'
import User from '@/entities/User/User'

jest.mock('@mantine/modals', () => ({
  modals: { open: jest.fn(), openConfirmModal: jest.fn(), closeAll: jest.fn() },
}))
jest.mock('@mantine/notifications', () => ({ notifications: { show: jest.fn() } }))
jest.mock('@/services/projects', () => ({
  ...jest.requireActual('@/services/projects'),
  Projects: {
    getEnrollmentInvitations: jest.fn(),
    cancelEnrollmentInvitation: jest.fn(),
  },
}))
const mockedProjects = Projects as jest.Mocked<typeof Projects>
const mockedModals = modals as jest.Mocked<typeof modals>

const confirmLastModal = () => {
  const [options] = mockedModals.openConfirmModal.mock.calls.at(-1)!
  options.onConfirm?.()
}

const sender = { id: 2, firstName: 'Camila', lastName: 'Villa', email: 'user2@example.com' }

const invitation = (
  userId: number,
  firstName: string,
  requestState: RequestState,
  requesterMessage?: string
): EnrollmentInvitationShow => ({
  id: userId,
  requestState,
  adminMessage: '<p>Te invito</p>',
  requesterMessage,
  creationDate: '2026-10-22',
  user: { id: userId, firstName, lastName: 'Pérez' } as User,
  sender,
})

describe('EnrollmentInvitationList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when there are pending and declined invitations', () => {
    beforeEach(() => {
      mockedProjects.getEnrollmentInvitations.mockResolvedValue({
        enrollmentInvitations: [
          invitation(8, 'Ana', RequestState.Pending),
          invitation(9, 'Luis', RequestState.Declined, '<p>No puedo</p>'),
        ],
      })
      mockedProjects.cancelEnrollmentInvitation.mockResolvedValue()
    })

    it('should show each invitation with its state, user and sender', async () => {
      renderWithQueryClient(<EnrollmentInvitationList projectId={1} />)

      const cards = await screen.findAllByTestId('invitation-card')
      expect(cards).toHaveLength(2)

      const [pending, declined] = cards
      expect(within(pending).getByTestId('invitation-card-user')).toHaveTextContent('Ana Pérez')
      expect(within(pending).getByTestId('invitation-card-user')).toHaveAttribute(
        'href',
        '/users/8'
      )
      expect(within(pending).getByTestId('invitation-card-state')).toHaveTextContent('Pendiente')
      expect(within(pending).getByTestId('invitation-card-sender')).toHaveTextContent(
        'Invitado por Camila Villa'
      )
      expect(within(declined).getByTestId('invitation-card-state')).toHaveTextContent('Declinada')
    })

    it('should let the admin edit or cancel a pending invitation', async () => {
      renderWithQueryClient(<EnrollmentInvitationList projectId={1} />)

      const [pending] = await screen.findAllByTestId('invitation-card')
      expect(within(pending).getByRole('button', { name: 'Editar invitación' })).toBeInTheDocument()
      expect(
        within(pending).queryByRole('button', { name: 'Ver respuesta del usuario' })
      ).toBeNull()

      await userEvent.click(within(pending).getByRole('button', { name: 'Cancelar invitación' }))
      expect(mockedProjects.cancelEnrollmentInvitation).not.toHaveBeenCalled()
      expect(mockedModals.openConfirmModal).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Cancelar invitación' })
      )

      confirmLastModal()

      await waitFor(() =>
        expect(mockedProjects.cancelEnrollmentInvitation).toHaveBeenCalledWith(1, 8)
      )
    })

    it('should let the admin read the answer and dismiss a declined invitation', async () => {
      renderWithQueryClient(<EnrollmentInvitationList projectId={1} />)

      const [, declined] = await screen.findAllByTestId('invitation-card')
      expect(
        within(declined).getByRole('button', { name: 'Ver respuesta del usuario' })
      ).toBeInTheDocument()
      expect(within(declined).queryByRole('button', { name: 'Editar invitación' })).toBeNull()

      await userEvent.click(within(declined).getByRole('button', { name: 'Descartar invitación' }))
      confirmLastModal()

      await waitFor(() =>
        expect(mockedProjects.cancelEnrollmentInvitation).toHaveBeenCalledWith(1, 9)
      )
    })
  })

  describe('when the invitations cannot be loaded', () => {
    it('should show the API message in Spanish', async () => {
      mockedProjects.getEnrollmentInvitations.mockRejectedValue(
        Object.assign(new Error('Request failed with status code 403'), {
          isAxiosError: true,
          response: { data: { message: 'No tienes autorización' } },
        })
      )

      renderWithQueryClient(<EnrollmentInvitationList projectId={1} />)

      expect(await screen.findByText('No tienes autorización')).toBeInTheDocument()
      expect(screen.queryByText(/Request failed/)).toBeNull()
    })
  })

  describe('when there are no invitations', () => {
    it('should say so', async () => {
      mockedProjects.getEnrollmentInvitations.mockResolvedValue({ enrollmentInvitations: [] })

      renderWithQueryClient(<EnrollmentInvitationList projectId={1} />)

      expect(await screen.findByTestId('invitation-list-empty')).toBeInTheDocument()
    })
  })
})
