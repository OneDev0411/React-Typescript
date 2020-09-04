import React from 'react'

const simpleField = ({ input, label, placeholder, meta, ...rest }) => {
  const { touched, error } = meta
  const hasError = touched && error

  return (
    <div className={`c-simple-field ${input.name}`}>
      <label htmlFor={input.name} className="c-simple-field__label">
        {label}
      </label>
      <input
        {...input}
        {...rest}
        id={input.name}
        placeholder={placeholder}
        className="c-simple-field__input"
      />
      {hasError && <div className="c-auth__field__error-alert">{error}</div>}
    </div>
  )
}

export default simpleField
