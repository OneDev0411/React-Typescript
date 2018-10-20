import React from 'react'
import { Field } from 'react-final-form'

export const ConditionField = props => (
  <Field name={props.when} subscription={{ value: true }}>
    {({ input: { value } }) =>
      (typeof props.condition === 'function' && props.condition(value)) ||
      value === props.is
        ? props.children
        : null
    }
  </Field>
)
