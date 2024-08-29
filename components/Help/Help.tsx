import React from 'react'

import HelpManuals from './HelpManuals'
import ReportBug from './ReportBug'
import SkeletonFull from '../Common/Loader/SkeletonFull'
import { useQuery } from '@tanstack/react-query'
import { CurrentUserQueryOptions } from '../../services/currentUser'

const Help = () => {
  const currentUserQuery = useQuery(CurrentUserQueryOptions.currentUser())

  if (currentUserQuery.isLoading) {
    return <SkeletonFull />
  }

  return (
    <>
      <HelpManuals
        currentUser={currentUserQuery.data === null ? undefined : currentUserQuery.data}
      />
      <ReportBug />
    </>
  )
}

export default Help
