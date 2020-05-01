import React, { useState, useEffect } from 'react'
import useDebouncedCallback from 'use-debounce/lib/callback'
import { TextField as MuiTextField } from '@material-ui/core'

import { FieldProps } from './types'

export default function TextField({
  value = '',
  names,
  onChange,
  ...props
}: FieldProps) {
  const [innerValue, setInnerValue] = useState<string>(value)
  const [debouncedOnChange] = useDebouncedCallback(onChange, 300)

  useEffect(() => {
    setInnerValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    setInnerValue(newValue)
    debouncedOnChange(names, newValue)
  }

  return (
    <MuiTextField
      {...props}
      value={innerValue}
      onChange={handleChange}
      size="small"
      variant="outlined"
    />
  )
}
