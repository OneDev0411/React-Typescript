import React from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import { FieldInputProps } from 'react-final-form'

import { LEGAL_PREFIXES } from '../../../constants/legal_prefixes'

const options = ['', ...LEGAL_PREFIXES].map(value => ({
  value,
  label: value || 'Select Title'
}))

interface Props {
  isVisible: boolean
  input: FieldInputProps<any, HTMLElement>
}

export function TitleInput({ isVisible, input }: Props) {
  if (!isVisible) {
    return null
  }

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel id="create-role--role-type">Title</InputLabel>
      <Select
        labelId="create-role--role-type"
        label="Title"
        value={input.value}
        onChange={e => input.onChange(e.target.value)}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
