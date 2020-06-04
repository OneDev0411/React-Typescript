import React from 'react'
import { TextField } from '@material-ui/core'

import { LoadingIcon } from '../styled'

export function EditMode({ value, loading, onChange }) {
  return (
    <>
      <TextField
        variant="standard"
        fullWidth
        autoFocus
        disabled={loading}
        value={value}
        onChange={({ target: { value } }) => onChange(value)}
      />
      {loading && <LoadingIcon />}
    </>
  )
}
