import '@testing-library/jest-dom/extend-expect'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { renderWithQueryClient, screen, userEvent } from '../utils/tests'
import EnrollmentButtonRequest from '@/components/Enrollment/Request/EnrollmentButtonRequest'
import { RequestState } from '@/entities/Project/ProjectInList'

jest.mock('@mantine/modals', () => ({ modals: { open: jest.fn(), closeAll: jest.fn() } }))
jest.mock('@mantine/notifications', () => ({ notifications: { show: jest.fn() } }))
const mockCurrentUser = { id: 8, isEmailVerified: true }
let mockCurrentUserState: 'loaded' | 'failed' | 'loading' = 'loaded'
jest.mock('@/services/currentUser', () => ({
  CurrentUserQueryOptions: {
    currentUser: () => ({
      queryKey: ['currentUser'],
      queryFn: () => {
        if (mockCurrentUserState === 'failed') return Promise.reject(new Error('401'))
        if (mockCurrentUserState === 'loading') return new Promise(() => {})
        return Promise.resolve(mockCurrentUser)
      },
    }),
  },
}))

describe('EnrollmentButtonRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCurrentUser.isEmailVerified = true
    mockCurrentUserState = 'loaded'
  })

  describe('when the pending enrollment is an invitation', () => {
    const renderInvitation = () =>
      renderWithQueryClient(
        <EnrollmentButtonRequest
          projectId={1}
          requestState={RequestState.Pending}
          adminMessage="<p>Te invito</p>"
          senderName="Camila Villa"
        />
      )

    it('should offer to view, accept or decline it, not to cancel a request', async () => {
      renderInvitation()

      await userEvent.click(screen.getByRole('button', { name: 'Opciones de invitación' }))

      expect(await screen.findByRole('menuitem', { name: 'Ver invitación' })).toBeInTheDocument()
      expect(screen.getByRole('menuitem', { name: 'Aceptar invitación' })).toBeInTheDocument()
      expect(screen.getByRole('menuitem', { name: 'Declinar invitación' })).toBeInTheDocument()
      expect(screen.queryByRole('menuitem', { name: 'Cancelar solicitud' })).toBeNull()
    })

    it.each([
      ['Aceptar invitación', 'accept'],
      ['Declinar invitación', 'decline'],
    ])('should open the answer form when clicking %s', async (item, action) => {
      renderInvitation()

      await userEvent.click(screen.getByRole('button', { name: 'Opciones de invitación' }))
      await userEvent.click(await screen.findByRole('menuitem', { name: item }))

      expect(modals.open).toHaveBeenCalledWith(
        expect.objectContaining({
          title: item,
          children: expect.objectContaining({ props: { projectId: 1, action } }),
        })
      )
    })

    it('should ask an unverified user to verify their email before answering', async () => {
      mockCurrentUser.isEmailVerified = false
      renderInvitation()
      // Let the current user query resolve
      await new Promise((resolve) => setTimeout(resolve, 0))

      await userEvent.click(screen.getByRole('button', { name: 'Opciones de invitación' }))
      await userEvent.click(await screen.findByRole('menuitem', { name: 'Aceptar invitación' }))

      expect(modals.open).not.toHaveBeenCalled()
      expect(notifications.show).toHaveBeenCalled()
    })

    it('should ask a user who is not logged in to log in before answering', async () => {
      mockCurrentUserState = 'failed'
      renderInvitation()
      // Let the current user query fail
      await new Promise((resolve) => setTimeout(resolve, 0))

      await userEvent.click(screen.getByRole('button', { name: 'Opciones de invitación' }))
      await userEvent.click(await screen.findByRole('menuitem', { name: 'Aceptar invitación' }))

      expect(modals.open).not.toHaveBeenCalled()
      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Debes iniciar sesión para responder invitaciones de inscripción',
        })
      )
    })

    it('should do nothing while the current user is loading', async () => {
      mockCurrentUserState = 'loading'
      renderInvitation()

      await userEvent.click(screen.getByRole('button', { name: 'Opciones de invitación' }))
      await userEvent.click(await screen.findByRole('menuitem', { name: 'Aceptar invitación' }))

      expect(modals.open).not.toHaveBeenCalled()
      expect(notifications.show).not.toHaveBeenCalled()
    })

    it('should show who sent the invitation', async () => {
      renderInvitation()

      await userEvent.click(screen.getByRole('button', { name: 'Opciones de invitación' }))
      await userEvent.click(await screen.findByRole('menuitem', { name: 'Ver invitación' }))

      expect(modals.open).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Invitación de Camila Villa' })
      )
    })
  })

  describe('when the user declined an invitation', () => {
    it('should let them request to enroll', () => {
      renderWithQueryClient(
        <EnrollmentButtonRequest projectId={1} requestState={RequestState.Declined} />
      )

      expect(screen.getByRole('button', { name: 'Solicitar inscripción' })).toBeInTheDocument()
    })
  })

  describe('when the pending enrollment is a request from the user', () => {
    it('should offer to cancel the request', async () => {
      renderWithQueryClient(
        <EnrollmentButtonRequest projectId={1} requestState={RequestState.Pending} />
      )

      await userEvent.click(screen.getByRole('button', { name: 'Opciones de solicitud' }))

      expect(
        await screen.findByRole('menuitem', { name: 'Cancelar solicitud' })
      ).toBeInTheDocument()
      expect(screen.queryByRole('menuitem', { name: 'Aceptar invitación' })).toBeNull()
    })
  })
})
