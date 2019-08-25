import React, { CSSProperties } from 'react'
import { Input } from '@material-ui/core'

import { ErrorContainer } from './styled'

interface Props {
  value: string
  placeholder?: string
  style?: CSSProperties
  multiline?: boolean
  error?: string
  onChange: (value: string) => any
}

export default function EditMode({
  value,
  placeholder = '',
  style = {},
  error = '',
  onChange
}: Props) {
  return (
    <>
      <Input
        autoFocus
        disableUnderline
        fullWidth
        placeholder={placeholder}
        style={style}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {error && <ErrorContainer>{error}</ErrorContainer>}
    </>
  )
}
