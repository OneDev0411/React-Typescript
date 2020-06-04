import React from 'react'
import { Field } from 'redux-form'

const SwitchToggle = ({
  name,
  value,
  isField = false,
  disabled = false,
  className = '',
  onChangeHandler = () => {}
}) => {
  const id = `${name}_checkbox`

  return (
    <div className={`c-switch-toggle ${className}`}>
      {isField ? (
        <Field
          name={name}
          type="checkbox"
          component="input"
          disabled={disabled}
          id={id}
          normalize={v => (v ? value : null)}
          onChange={onChangeHandler}
        />
      ) : (
        <input
          type="checkbox"
          checked={value}
          id={id}
          onChange={event => onChangeHandler(event)}
        />
      )}
      <label htmlFor={id}>
        <span />
      </label>
    </div>
  )
}

export default SwitchToggle
