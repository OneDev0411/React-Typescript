import React from 'react'
import cn from 'classnames'

function TextField({ input, meta, name, title, isRequired, placeholder }) {
  const { error, touched } = meta
  const hasError = error && touched

  return (
    <div className={cn('c-new-address-modal__field', { hasError })}>
      <label
        htmlFor={`add-new-address__${name}`}
        className="c-new-address-modal__field__label"
      >
        {title}
        {isRequired && <b style={{ color: 'red', fontSize: '1.8rem' }}> *</b>}
      </label>
      <input
        {...input}
        type="text"
        placeholder={placeholder}
        id={`add-new-address__${name}`}
        className="c-new-address-modal__field__input"
      />
      {hasError && (
        <div style={{ marginTop: '0.5em', color: 'red' }}>{error}</div>
      )}
    </div>
  )
}

export default TextField
