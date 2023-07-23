import { Box, Center, Text } from '@mantine/core'
import { Check, X } from 'tabler-icons-react'

const Requirement = ({ meets, label }: { meets: boolean; label: string }) => {
    return (
        <Text color={meets ? 'teal' : 'red'} mt={5} size="sm">
            <Center inline>
                {meets ? <Check size={14} /> : <X size={14} />}
                <Box ml={7}>{label}</Box>
            </Center>
        </Text>
    )
}

export default Requirement
