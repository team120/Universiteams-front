import React from 'react'
import { Progress, Text } from '@mantine/core'
import Requirement from './Requirement'
import { IRequirement } from '@/services/password'

interface PasswordStrengthProps {
  strength: number
  phrase: string
  color: string
  requirements: IRequirement[]
  formValue: string
}

function PasswordStrength({
  strength,
  phrase,
  color,
  requirements,
  formValue,
}: PasswordStrengthProps) {
  const checks = requirements.map((requirement, index) => (
    <Requirement key={index} meets={requirement.validate(formValue)} label={requirement.label} />
  ))

  return (
    <>
      <Progress mt="xs" value={strength} color={color} />
      <Text size="sm" style={{ align: 'center' }} c={color}>
        {phrase}
      </Text>
      {checks}
    </>
  )
}

export default PasswordStrength
