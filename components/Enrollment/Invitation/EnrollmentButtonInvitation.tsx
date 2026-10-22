import React from 'react'
import { ActionIcon } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { IconUserPlus } from '@tabler/icons-react'

import { CurrentUserInfo } from '@/services/currentUser'

import { EnrollmentInvitationCreate } from './EnrollmentInvitationCreate'
import ProjectInList from '@/entities/Project/ProjectInList'
import { verifyEmailNotification } from '@/components/Account/VerifyEmailNotification'

interface EnrollmentButtonInvitationProps {
  currentUser: CurrentUserInfo
  userId: number
  userFullName: string
  invitableProjects: ProjectInList[]
}

// Lets a project admin or leader invite the user of the profile being viewed
const EnrollmentButtonInvitation = (props: EnrollmentButtonInvitationProps): React.JSX.Element => {
  const handleInviteClick = () => {
    if (props.currentUser.isEmailVerified === false) {
      notifications.show(verifyEmailNotification('invitar usuarios a tus proyectos'))

      return
    }

    modals.open({
      title: `Invitar a ${props.userFullName}`,
      centered: true,
      children: (
        <EnrollmentInvitationCreate
          userId={props.userId}
          invitableProjects={props.invitableProjects}
        />
      ),
    })
  }

  return (
    <ActionIcon
      variant="transparent"
      aria-label="Invitar a un proyecto"
      onClick={handleInviteClick}
      size="lg"
      color="gray">
      <IconUserPlus />
    </ActionIcon>
  )
}

export default EnrollmentButtonInvitation
