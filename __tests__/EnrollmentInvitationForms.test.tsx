import '@testing-library/jest-dom/extend-expect'
import { renderWithQueryClient, screen, userEvent } from '../utils/tests'
import { EnrollmentInvitationCreate } from '@/components/Enrollment/Invitation/EnrollmentInvitationCreate'
import { EnrollmentInvitationUpdate } from '@/components/Enrollment/Invitation/EnrollmentInvitationUpdate'
import { EnrollmentRequestUpdate } from '@/components/Enrollment/Request/EnrollmentRequestUpdate'
import { Projects } from '@/services/projects'
import ProjectInList from '@/entities/Project/ProjectInList'

jest.mock('@mantine/modals', () => ({ modals: { open: jest.fn(), closeAll: jest.fn() } }))
jest.mock('@mantine/notifications', () => ({ notifications: { show: jest.fn() } }))
jest.mock('@/components/Common/TextEditor/TextEditor', () =>
  require('../utils/tests/TextEditorMock')
)
jest.mock('@/services/projects', () => ({
  ...jest.requireActual('@/services/projects'),
  Projects: {
    createEnrollmentInvitation: jest.fn(),
    updateEnrollmentInvitation: jest.fn(),
    updateEnrollmentRequest: jest.fn(),
  },
}))
const mockedProjects = Projects as jest.Mocked<typeof Projects>

describe('EnrollmentInvitationCreate', () => {
  const invitableProjects = [
    { id: 10, name: 'Proyecto A' },
    { id: 11, name: 'Proyecto B' },
  ] as ProjectInList[]

  beforeEach(() => {
    jest.clearAllMocks()
    mockedProjects.createEnrollmentInvitation.mockResolvedValue()
  })

  it('should require a project', async () => {
    renderWithQueryClient(
      <EnrollmentInvitationCreate userId={8} invitableProjects={invitableProjects} />
    )

    await userEvent.click(screen.getByRole('button', { name: 'Invitar' }))

    expect(await screen.findByText('Selecciona un proyecto')).toBeInTheDocument()
    expect(mockedProjects.createEnrollmentInvitation).not.toHaveBeenCalled()
  })

  it('should invite the user to the selected project', async () => {
    renderWithQueryClient(
      <EnrollmentInvitationCreate userId={8} invitableProjects={invitableProjects} />
    )

    await userEvent.click(screen.getByRole('textbox', { name: 'Proyecto' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Proyecto B' }))
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Mensaje de la invitación' }),
      'Te invito'
    )
    await userEvent.click(screen.getByRole('button', { name: 'Invitar' }))

    expect(mockedProjects.createEnrollmentInvitation).toHaveBeenCalledWith(11, 8, {
      message: 'Te invito',
    })
  })
})

describe('Update forms', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedProjects.updateEnrollmentInvitation.mockResolvedValue()
    mockedProjects.updateEnrollmentRequest.mockResolvedValue()
  })

  it('should keep the invitation message when saved without edits', async () => {
    renderWithQueryClient(
      <EnrollmentInvitationUpdate projectId={1} userId={8} content="<p>Te invito</p>" />
    )

    await userEvent.click(screen.getByRole('button', { name: 'Actualizar invitación' }))

    expect(mockedProjects.updateEnrollmentInvitation).toHaveBeenCalledWith(1, 8, {
      message: '<p>Te invito</p>',
    })
  })

  it('should keep the request message when saved without edits', async () => {
    renderWithQueryClient(
      <EnrollmentRequestUpdate projectId={1} content="<p>Quiero participar</p>" />
    )

    await userEvent.click(screen.getByRole('button'))

    expect(mockedProjects.updateEnrollmentRequest).toHaveBeenCalledWith(1, {
      message: '<p>Quiero participar</p>',
    })
  })
})
