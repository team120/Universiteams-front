'use client'
import React from 'react'
import UserDetails from '@/components/User/UserDetails'

interface UserDetailsParams {
  // Route params are always strings
  params: { id: string }
}

const UserDetailsPage = ({ params }: UserDetailsParams) => {
  return <UserDetails id={Number(params.id)} />
}

export default UserDetailsPage
