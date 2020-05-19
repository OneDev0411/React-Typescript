import React from 'react'
import {
  Checkbox,
  CheckboxProps,
  ListItem,
  ListItemText
} from '@material-ui/core'

interface Props {
  checked: boolean
  onChange: CheckboxProps['onChange']
  title: string
}

export function ViewAsMember({ checked, onChange, title }: Props) {
  return (
    <ListItem dense>
      <ListItemText primaryTypographyProps={{ noWrap: true }}>
        {title}
      </ListItemText>
      <Checkbox checked={checked} onChange={onChange} />
    </ListItem>
  )
}
