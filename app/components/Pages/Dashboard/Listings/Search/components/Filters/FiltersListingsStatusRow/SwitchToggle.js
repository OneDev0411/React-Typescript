import React from 'react'
import pure from 'recompose/pure'
import { Field } from 'redux-form'

const SwitchToggle = ({
  name,
  value,
  isField,
  disabled,
  className,
  onChangeHandler
}) => (
  <div className={`c-switch-toggle ${className}`}>
    {isField ? (
      <Field
        name={name}
        type="checkbox"
        component="input"
        disabled={disabled}
        id={`${name}_checkbox`}
        normalize={v => (v ? value : null)}
        onChange={(event, newValue, previousValue) =>
          onChangeHandler(event, newValue)}
      />
    ) : (
      <input
        type="checkbox"
        checked={value}
        id={`${name}_checkbox`}
        onChange={event => onChangeHandler(event)}
      />
    )}
    <label htmlFor={`${name}_checkbox`}>
      <span />
    </label>
  </div>
)

export default pure(SwitchToggle)
