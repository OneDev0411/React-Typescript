import React from 'react'
import {
  Checkbox,
  CheckboxProps,
  ListItem,
  ListItemText,
  Tooltip
} from '@material-ui/core'

interface Props {
  checked: boolean
  onChange: CheckboxProps['onChange']
  title: string
}

export function ViewAsMember({ checked, onChange, title }: Props) {
  return (
    <ListItem dense>
      <Tooltip title={title}>
        <ListItemText primaryTypographyProps={{ noWrap: true }}>
          {title}
        </ListItemText>
      </Tooltip>
      <Checkbox checked={checked} onChange={onChange} />
    </ListItem>
  )
}
