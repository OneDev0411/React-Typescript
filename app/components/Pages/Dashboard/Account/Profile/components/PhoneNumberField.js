import React from 'react'
import MaskedInput from 'react-input-mask'

const PhoneNumberField = ({ type, input, label, meta: { dirty, error } }) => {
  const hasError = dirty && error

  return (
    <div className={`c-simple-field ${input.name}`}>
      <label htmlFor={input.name} className="c-simple-field__label">
        {label}
      </label>
      <MaskedInput
        {...input}
        type={type}
        id={input.name}
        mask="(999) 999-9999"
        className={`c-simple-field__input ${hasError ? 'has-error' : ''}`}
      />
      {hasError && <div className="c-auth__field__error-alert">{error}</div>}
    </div>
  )
}

export default PhoneNumberField
