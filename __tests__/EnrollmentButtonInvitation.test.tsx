import '@testing-library/jest-dom/extend-expect'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { render, screen, userEvent } from '../utils/tests'
import EnrollmentButtonInvitation from '@/components/Enrollment/Invitation/EnrollmentButtonInvitation'
import { CurrentUserInfo, UserSystemRole } from '@/services/currentUser'
import ProjectInList from '@/entities/Project/ProjectInList'

jest.mock('@mantine/modals', () => ({ modals: { open: jest.fn() } }))
jest.mock('@mantine/notifications', () => ({ notifications: { show: jest.fn() } }))

const currentUser = (isEmailVerified: boolean): CurrentUserInfo => ({
  id: 2,
  user: 'Camila',
  email: 'user2@example.com',
  isEmailVerified,
  systemRole: UserSystemRole.USER,
})

const renderButton = (isEmailVerified: boolean) =>
  render(
    <EnrollmentButtonInvitation
      currentUser={currentUser(isEmailVerified)}
      userId={8}
      userFullName="Ana Pérez"
      invitableProjects={[{ id: 10, name: 'Proyecto A' } as ProjectInList]}
    />
  )

describe('EnrollmentButtonInvitation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should open the invitation form for the user', async () => {
    renderButton(true)

    await userEvent.click(screen.getByRole('button', { name: 'Invitar a un proyecto' }))

    expect(modals.open).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Invitar a Ana Pérez',
        children: expect.objectContaining({
          props: { userId: 8, invitableProjects: [{ id: 10, name: 'Proyecto A' }] },
        }),
      })
    )
  })

  it('should ask an unverified user to verify their email first', async () => {
    renderButton(false)

    await userEvent.click(screen.getByRole('button', { name: 'Invitar a un proyecto' }))

    expect(modals.open).not.toHaveBeenCalled()
    expect(notifications.show).toHaveBeenCalled()
  })
})
