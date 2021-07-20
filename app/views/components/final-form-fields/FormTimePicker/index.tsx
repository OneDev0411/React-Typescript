import React from 'react'
import { Field } from 'react-final-form'

import { FieldState } from 'final-form'

import TimePicker, { TimePickerProps } from 'components/TimePicker'

import { FinalFieldProps } from '../types'

export type FormTimePickerProps = FinalFieldProps<TimePickerProps>

function FormTimePicker({
  name,
  format,
  helperText,
  margin = 'normal',
  validate,
  min,
  max,
  error,
  ...otherProps
}: FormTimePickerProps) {
  const minMaxValidate = (
    value: string,
    allValues: object,
    meta?: FieldState<string> | undefined
  ) => {
    if (min && value <= min) {
      return `The time must be no earlier than ${min}`
    }

    if (max && value > max) {
      return `The time must be no later than ${max}`
    }

    if (validate) {
      return validate(value, allValues, meta)
    }
  }

  return (
    <Field
      name={name}
      format={format}
      validate={minMaxValidate}
      render={({ input: { name, value, onChange, ...restInput }, meta }) => {
        const hasError: boolean =
          ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
          meta.touched

        return (
          <TimePicker
            {...otherProps}
            value={value}
            onChange={onChange}
            inputProps={restInput}
            margin={margin}
            error={hasError || error}
            helperText={hasError ? meta.error || meta.submitError : helperText}
          />
        )
      }}
    />
  )
}

export default FormTimePicker
