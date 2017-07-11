import React from 'react'
import pure from 'recompose/pure'
import { Field } from 'redux-form'

import Label from './Label'

const renderField = ({
  type,
  input,
  label,
  className,
  placeholder,
  meta: { touched, error, warning }
}) =>
  <div
    className={`c-min-max-inputs__${input.name.indexOf('min') === 0
      ? 'min'
      : 'max'}`}
  >
    <label htmlFor={input.name} className="c-min-max-inputs__label">
      {label}
    </label>
    {touched &&
      (error &&
        <div className="c-min-max-inputs__alert has-error">
          {error}
        </div>)}
    {touched &&
      (warning &&
        <div className="c-min-max-inputs__alert has-warning">
          {warning}
        </div>)}
    <input
      {...input}
      type={type}
      className={className}
      placeholder={placeholder}
    />
  </div>

const MinMaxInputs = ({
  warn,
  name,
  label,
  validate,
  formatHandler,
  placeholder = 'Any'
}) => {
  const minName = `minimum_${name}`
  const maxName = `maximum_${name}`

  return (
    <Label label={label}>
      <div className="c-min-max-inputs">
        <Field
          name={minName}
          type="text"
          id={minName}
          label="Min."
          component={renderField}
          warn={warn}
          validate={validate}
          format={formatHandler}
          placeholder={placeholder}
          className="c-min-max-inputs__field"
        />
        <Field
          name={maxName}
          type="input"
          id={maxName}
          label="Max."
          component={renderField}
          warn={warn}
          validate={validate}
          format={formatHandler}
          placeholder={placeholder}
          className="c-min-max-inputs__field"
        />
      </div>
    </Label>
  )
}

export default pure(MinMaxInputs)
