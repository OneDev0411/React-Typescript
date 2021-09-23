import React from 'react'

import { Field, FieldProps, FieldRenderProps } from 'react-final-form'
import { OnChange } from 'react-final-form-listeners'

interface Props {
  set: string
  watch: string
  setter: (
    handleOnChange: (value: unknown) => void,
    fieldRenderProps: Omit<FieldRenderProps<any>, 'input'>
  ) => void
  otherFieldProps?: Omit<FieldProps<string, any>, 'name'>
}

export const FieldWatcher = ({
  watch,
  set,
  setter,
  otherFieldProps = {}
}: Props) => {
  return (
    <Field name={set} {...otherFieldProps}>
      {({ input: { onChange }, ...restProps }) => (
        <OnChange name={watch}>{() => setter(onChange, restProps)}</OnChange>
      )}
    </Field>
  )
}
