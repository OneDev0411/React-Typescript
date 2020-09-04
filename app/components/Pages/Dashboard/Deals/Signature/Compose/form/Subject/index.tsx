import React from 'react'

import { useField } from 'react-final-form'

import { TextInput } from 'components/Forms/TextInput'

export function Subject() {
  const field = useField('subject')

  return <TextInput label="Subject" isRequired input={field.input} />
}
