import React, { CSSProperties } from 'react'
import { Input } from '@material-ui/core'

interface Props {
  value: string
  placeholder?: string
  style?: CSSProperties
  multiline?: boolean
  onChange: (value: string) => any
}

export default function EditMode({
  value,
  placeholder = '',
  style = {},
  onChange
}: Props) {
  return (
    <Input
      autoFocus
      disableUnderline
      fullWidth
      placeholder={placeholder}
      style={style}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  )
}
