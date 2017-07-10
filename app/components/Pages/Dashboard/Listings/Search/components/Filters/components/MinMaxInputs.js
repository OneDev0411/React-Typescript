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
  meta: { touched, error }
}) =>
  <div
    className={`c-min-max-inputs__${input.name.indexOf('min') === 0
      ? 'min'
      : 'max'}`}
  >
    <label htmlFor={input.name} className="c-min-max-inputs__label">
      {label}
    </label>
    <input
      {...input}
      type={type}
      className={className}
      placeholder={placeholder}
    />
    {touched &&
      (error &&
        <div className="c-min-max-inputs__alert has-error">
          {error}
        </div>)}
  </div>

const MinMaxInputs = ({
  label,
  minName,
  maxName,
  formatHandler,
  placeholder = 'Any'
}) =>
  <Label label={label}>
    <div className="c-min-max-inputs">
      <Field
        id={minName}
        label="Min."
        type="text"
        name={minName}
        format={formatHandler}
        component={renderField}
        placeholder={placeholder}
        className="c-min-max-inputs__field"
      />
      <Field
        id={maxName}
        label="Max."
        type="number"
        name={maxName}
        format={formatHandler}
        component={renderField}
        placeholder={placeholder}
        className="c-min-max-inputs__field"
      />
    </div>
  </Label>

export default pure(MinMaxInputs)
