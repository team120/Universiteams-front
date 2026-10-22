import '@testing-library/jest-dom/extend-expect'
import { modals } from '@mantine/modals'
import { renderWithQueryClient, screen, userEvent } from '../utils/tests'
import EnrollmentButtonRequest from '@/components/Enrollment/Request/EnrollmentButtonRequest'
import { RequestState } from '@/entities/Project/ProjectInList'

jest.mock('@mantine/modals', () => ({ modals: { open: jest.fn(), closeAll: jest.fn() } }))
jest.mock('@/services/currentUser', () => ({
  CurrentUserQueryOptions: {
    currentUser: () => ({ queryKey: ['currentUser'], queryFn: () => ({ id: 8 }) }),
  },
}))

describe('EnrollmentButtonRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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

    it('should show who sent the invitation', async () => {
      renderInvitation()

      await userEvent.click(screen.getByRole('button', { name: 'Opciones de invitación' }))
      await userEvent.click(await screen.findByRole('menuitem', { name: 'Ver invitación' }))

      expect(modals.open).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Invitación de Camila Villa' })
      )
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
