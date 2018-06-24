import React from 'react'

import { ErrorMessage, Input } from '../../../../styled-components/field'

export function TextField(props) {
  const { error, touched } = props.meta
  const hasError = error && touched

  return (
    <div style={{ width: 'calc(100% - 40px)' }}>
      <Input
        {...props.input}
        id={props.id || `new-contact__${input.name}`}
        placeholder={props.placeholder}
        type="text"
      />
      {hasError && (
        <ErrorMessage style={{ wordWrap: 'break-word' }}>{error}</ErrorMessage>
      )}
    </div>
  )
}
