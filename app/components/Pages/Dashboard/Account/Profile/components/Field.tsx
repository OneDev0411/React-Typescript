import React from 'react'
import {
  Field as ReduxFormField,
  GenericFieldHTMLAttributes,
  BaseFieldProps
} from 'redux-form'
import { Typography } from '@material-ui/core'

type Props = (GenericFieldHTMLAttributes | BaseFieldProps) & {
  label: string
}

export default function Field({ label, ...otherProps }: Props) {
  const TypelessReduxFormField = ReduxFormField as any

  return (
    <TypelessReduxFormField
      {...otherProps}
      label={<Typography variant="body2">{label}</Typography>}
    />
  )
}
