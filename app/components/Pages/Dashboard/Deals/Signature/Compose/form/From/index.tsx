import React from 'react'

import { useField } from 'react-final-form'

import { TextInput } from 'components/Forms/TextInput'

export function From() {
  const field = useField('from')

  return <TextInput readOnly label="From" input={field.input} />
}
