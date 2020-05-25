import React from 'react'
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@material-ui/core'

interface Props {
  title: string
  description: string
  icon: React.ReactElement<SVGElement>
  onClick: () => void
}

export function Item({ title, description, icon, onClick }: Props) {
  return (
    <ListItem button onClick={onClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      </ListItemText>
    </ListItem>
  )
}
