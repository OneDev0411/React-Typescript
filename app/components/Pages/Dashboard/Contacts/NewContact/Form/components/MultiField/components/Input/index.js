import React from 'react'

import { ErrorMessage, Input } from '../../../../styled-components/field'

export function TextField({ input, meta, placeholder }) {
  const { error, touched } = meta
  const hasError = error && touched

  return (
    <div style={{ width: 'calc(100% - 40px)' }}>
      <Input
        {...input}
        id={`new-contact__${input.name}`}
        placeholder={placeholder}
        type="text"
      />
      {hasError && (
        <ErrorMessage style={{ wordWrap: 'break-word' }}>{error}</ErrorMessage>
      )}
    </div>
  )
}
