import React from 'react'
import { Flex, Text } from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons-react';

const Requirement = ({ meets, label }: { meets: boolean; label: string }) => {
  return (
    <Flex align="center" mt={5}>
      {meets ? <IconCheck size={14} color="teal.6" /> : <IconX size={14} color="red.8" />}
      <Text ml={7} size="sm" c={meets ? 'teal.6' : 'red.8'}>
        {label}
      </Text>
    </Flex>
  )
}

export default Requirement
