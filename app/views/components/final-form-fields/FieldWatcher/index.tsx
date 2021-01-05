import React from 'react'
import { Field } from 'react-final-form'
import { OnChange } from 'react-final-form-listeners'

interface Props {
  set: string
  watch: string
  setter: (handleOnChange: (value: unknown) => void) => void
}

export const FieldWatcher = ({ watch, set, setter }: Props) => {
  return (
    <Field name={set}>
      {({ input: { onChange } }) => (
        <OnChange name={watch}>{() => setter(onChange)}</OnChange>
      )}
    </Field>
  )
}
