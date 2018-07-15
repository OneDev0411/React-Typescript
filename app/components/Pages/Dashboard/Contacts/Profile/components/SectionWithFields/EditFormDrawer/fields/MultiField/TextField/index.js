import React from 'react'

import { ErrorMessage, Input } from '../../styled'

export function TextField(props) {
  const { meta } = props
  const hasError = meta.error && meta.touched

  return (
    <div style={{ width: 'calc(100% - 40px)' }}>
      <Input
        {...props.input}
        id={props.id || `new-contact__${input.name}`}
        placeholder={props.placeholder}
        readOnly={props.readOnly}
        type="text"
      />
      {hasError && (
        <ErrorMessage style={{ wordWrap: 'break-word' }}>
          {meta.error}
        </ErrorMessage>
      )}
    </div>
  )
}
