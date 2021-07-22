import React from 'react'

import { TextField as Input } from '@material-ui/core'

import { ErrorMessage } from './styled'

export function TextField({ input, meta, placeholder }) {
  const { error, touched } = meta
  const hasError = error && touched

  return (
    <div style={{ width: 'calc(100% - 2.5rem)' }}>
      <Input
        {...input}
        id={`new-contact__${input.name}`}
        placeholder={placeholder}
        autoComplete="disabled"
        type="text"
        fullWidth
      />
      {hasError && (
        <ErrorMessage style={{ wordWrap: 'break-word' }}>{error}</ErrorMessage>
      )}
    </div>
  )
}
