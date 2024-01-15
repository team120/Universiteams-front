import React from 'react'
import { Skeleton } from '@mantine/core'

const SkeletonSmall = () => {
  return (
    <>
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
    </>
  )
}

export default SkeletonSmall
