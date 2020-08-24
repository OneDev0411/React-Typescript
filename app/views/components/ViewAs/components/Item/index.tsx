import React from 'react'
import {
  Checkbox,
  CheckboxProps,
  ListItem,
  FormControlLabel
} from '@material-ui/core'

interface Props {
  checked: boolean
  disabled: boolean
  onChange: CheckboxProps['onChange']
  title: string
}

export const MemberItem = ({ checked, disabled, onChange, title }: Props) => {
  return (
    <ListItem dense disabled={disabled}>
      <FormControlLabel
        control={
          <Checkbox
            color="secondary"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
          />
        }
        label={title}
      />
    </ListItem>
  )
}
