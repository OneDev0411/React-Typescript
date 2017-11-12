import React from 'react'

const simpleField = ({ type, input, label, meta: { dirty, error } }) => {
  const hasError = dirty && error

  return (
    <div className={`c-simple-field ${input.name}`}>
      <label htmlFor={input.name} className="c-simple-field__label">
        {label}
      </label>
      <input
        {...input}
        type={type}
        id={input.name}
        className={`c-simple-field__input ${hasError ? 'has-error' : ''}`}
      />
      {hasError && <div className="c-auth__field__error-alert">{error}</div>}
    </div>
  )
}

export default simpleField
