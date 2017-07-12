import React from 'react'
import pure from 'recompose/pure'
import { Field } from 'redux-form'

const SwitchToggle = ({ name, value, className, onChangeHandler }) =>
  <div className={`c-switch-toggle ${className}`}>
    <Field
      name={name}
      type="checkbox"
      component="input"
      id={`${name}_checkbox`}
      normalize={v => (v ? value : null)}
      onChange={(event, newValue, previousValue) =>
        onChangeHandler(event, newValue)}
    />
    <label htmlFor={`${name}_checkbox`}>
      <span />
    </label>
  </div>

export default pure(SwitchToggle)
