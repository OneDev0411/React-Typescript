import React from 'react'

import { ErrorMessage, Input } from '../../../../styled-components/field'

export function TextField(props) {
  const { meta, attributeDef } = props
  const hasError = meta.error && meta.touched

  return (
    <div style={{ width: 'calc(100% - 40px)' }}>
      <Input
        {...props.input}
        id={props.id || `new-contact__${input.name}`}
        placeholder={attributeDef.label}
        type="text"
        readOnly={!attributeDef.editable}
        onBlur={event => props.onBlur(event.target.value, meta.initial)}
      />
      {hasError && (
        <ErrorMessage style={{ wordWrap: 'break-word' }}>{error}</ErrorMessage>
      )}
    </div>
  )
}
