import React from 'react'

import { FieldProps } from './types'
import ColorField from './Color'

// TODO: Implement real border field with type and width
export default function BorderField({ onChange, value, ...props }: FieldProps) {
  // The value is always like this: 1px solid red
  // So we can split it by space and get last part
  const valueParts = value.split(' ')
  const borderColor = valueParts[valueParts.length - 1]

  const handleChange: FieldProps['onChange'] = (names, value) => {
    onChange(names, `1px solid ${value}`)
  }

  return <ColorField {...props} value={borderColor} onChange={handleChange} />
}
