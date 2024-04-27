import React from 'react'
import { Flex, Text } from '@mantine/core'
import { Check, X } from 'tabler-icons-react'
import Theme from '../../src/app/theme'

const Requirement = ({ meets, label }: { meets: boolean; label: string }) => {
  return (
    <Flex align="center" mt={5}>
      {meets ? (
        <Check size={14} color={Theme.colors?.teal?.[6]} />
      ) : (
        <X size={14} color={Theme.colors?.red?.[6]} />
      )}
      <Text ml={7} size="sm" color={meets ? Theme.colors?.teal?.[6] : Theme.colors?.red?.[6]}>
        {label}
      </Text>
    </Flex>
  )
}

export default Requirement
