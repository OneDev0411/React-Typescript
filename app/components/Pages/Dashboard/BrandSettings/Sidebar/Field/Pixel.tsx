import React, { KeyboardEvent } from 'react'
import { TextField, InputAdornment, Typography } from '@material-ui/core'

import { FieldProps } from './types'

function addPixelValue(pixel: string = '1px', delta: number): string {
  const numericValue = Math.abs(parseInt(pixel, 10))

  return `${numericValue + delta}px`
}

export default function PixelField({
  value,
  label,
  onChange,
  names
}: FieldProps) {
  const handleChange = (value: string = '1px') => {
    const pxValue = `${Math.abs(parseInt(value, 10))}px`

    onChange(names, pxValue)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      handleChange(addPixelValue(value, 1))
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      handleChange(addPixelValue(value, -1))
    }
  }

  return (
    <TextField
      size="small"
      type="number"
      variant="outlined"
      label={label}
      value={parseInt(value, 10)}
      onChange={e => handleChange(e.target.value)}
      onKeyDown={handleKeyDown}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Typography variant="body2">px</Typography>
          </InputAdornment>
        )
      }}
    />
  )
}
