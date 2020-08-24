import React from 'react'
import {
  Checkbox,
  CheckboxProps,
  ListItem,
  ListItemText
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
      <ListItemText primaryTypographyProps={{ noWrap: true }}>
        {title}
      </ListItemText>
      <Checkbox checked={checked} disabled={disabled} onChange={onChange} />
    </ListItem>
  )
}
