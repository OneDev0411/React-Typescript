import React from 'react'
import pure from 'recompose/pure'
import { Field } from 'redux-form'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import Label from './Label'

const turnToNumber = value => (value ? Number(value.replace(/[^0-9]/g, '')) : null)

const renderField = ({
  type,
  input,
  label,
  className,
  placeholder,
  meta: { touched, error, warning }
}) => (
  <div
    className={`c-min-max-inputs__${input.name.indexOf('min') === 0
      ? 'min'
      : 'max'}`}
  >
    <label htmlFor={input.name} className="c-min-max-inputs__label">
      {label}
    </label>
    <input {...input} type={type} className={className} placeholder={placeholder} />
    {touched &&
      (error && <div className="c-min-max-inputs__alert has-error">{error}</div>)}
    {touched &&
      (warning && (
        <div className="c-min-max-inputs__alert has-warning">{warning}</div>
      ))}
  </div>
)

const MinMaxInputs = ({
  name,
  label,
  formatHandler,
  humanNumber,
  onChangeMin,
  validateMin = [],
  validateMax = [],
  validateMinValue,
  placeholder = 'Any',
  warnMin,
  warnMax
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
          warn={warnMin}
          validate={validateMin}
          format={formatHandler}
          placeholder={placeholder}
          normalize={v => v || null}
          onChange={(e, value, nextValue) => onChangeMin(value)}
          className="c-min-max-inputs__field"
        />
        <Field
          name={maxName}
          type="input"
          id={maxName}
          label="Max."
          component={renderField}
          warn={warnMax}
          format={formatHandler}
          placeholder={placeholder}
          normalize={v => v || null}
          validate={[...validateMax, validateMinValue]}
          className="c-min-max-inputs__field"
        />
      </div>
    </Label>
  )
}

export default compose(
  pure,
  withState('minimumValue', 'setMinimumValue', 0),
  withHandlers({
    onChangeMin: ({ setMinimumValue }) => value => {
      setMinimumValue(turnToNumber(value))
    },
    validateMinValue: ({ minimumValue, humanNumber }) => value =>
      value && minimumValue && turnToNumber(value) < minimumValue
        ? `Must be minimum ${humanNumber
          ? minimumValue.toLocaleString()
          : minimumValue}`
        : undefined
  })
)(MinMaxInputs)
