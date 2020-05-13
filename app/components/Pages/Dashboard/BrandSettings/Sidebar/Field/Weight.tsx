import React, { CSSProperties } from 'react'
import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

import { FieldProps } from './types'

const WEIGHT_OPTIONS: string[] = ['normal', 'bold', 'bolder', 'lighter']

export default function WeightField({
  value,
  label,
  onChange,
  names
}: FieldProps) {
  return (
    <Autocomplete
      disableClearable
      autoSelect
      openOnFocus
      size="small"
      noOptionsText="No result"
      options={WEIGHT_OPTIONS}
      value={value}
      getOptionLabel={option => option}
      renderOption={option => {
        return (
          <span style={{ fontWeight: option as CSSProperties['fontWeight'] }}>
            {option}
          </span>
        )
      }}
      renderInput={params => (
        <TextField {...params} label={label} variant="outlined" />
      )}
      onChange={(e: any, weight: string) => {
        onChange(names, weight)
      }}
    />
  )
}
