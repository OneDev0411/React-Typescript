import { Field } from 'react-final-form'

import React from 'react'

import { Checkbox } from 'components/Checkbox'

interface Props {
  permission: string
  fieldName: string
}

export function PermissionCell({ permission, fieldName }) {
  const toggle = input => {
    const newValue = input.value.includes(permission)
      ? input.value.filter(item => item !== permission)
      : [...input.value, permission]

    input.onChange(newValue)
  }

  return (
    <td key={permission} style={{ textAlign: 'center' }}>
      <Field name={fieldName}>
        {({ input }) => (
          <Checkbox
            onChange={() => toggle(input)}
            checked={input.value.includes(permission)}
          />
        )}
      </Field>
    </td>
  )
}
