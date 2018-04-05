import React from 'react'
import cn from 'classnames'

export default function Title(props) {
  const { input, meta } = props
  const { error, touched, active } = meta
  const hasError = error && touched

  return (
    <div
      className={cn('c-new-task__title c-new-task__field', {
        'is-active': active,
        'has-error': hasError
      })}
    >
      <label htmlFor="new-task__title" className="c-new-task__field__label">
        Title
        <b style={{ color: 'red' }}> *</b>
      </label>
      <input
        {...input}
        type="text"
        id="new-task__title"
        autoComplete="off"
        placeholder="Give me a title"
        className="c-new-task__field__input"
      />
      {hasError && <div className="c-new-task__field__error">{error}</div>}
    </div>
  )
}
