import React from 'react'
import { Box, Center, Text } from '@mantine/core'
import { Check, X } from 'tabler-icons-react'
import Theme from '../../src/app/theme'

const Requirement = ({ meets, label }: { meets: boolean; label: string }) => {
  return (
    <Text c={meets ? Theme.colors?.teal?.[6] : Theme.colors?.red?.[6]} mt={5} size="sm">
      <Center inline>
        {meets ? <Check size={14} /> : <X size={14} />}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  )
}

export default Requirement
