import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'

import IconDeleteOutline from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'

interface Props {
  name: String
}

function ContextItem({ name }: Props) {
  return (
    <ListItem>
      <ListItemText primary={name} />
      <ListItemSecondaryAction>
        <IconButton size="small" aria-label="delete">
          <IconDeleteOutline
            style={{ fill: 'currentColor', width: 16, height: 16 }}
          />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default ContextItem
