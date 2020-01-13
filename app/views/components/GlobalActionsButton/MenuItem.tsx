import React from 'react'
import {
  Theme,
  makeStyles,
  createStyles,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'

import { Item } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    itemButton: {
      '&:hover': {
        color: theme.palette.primary.main,
        background: theme.palette.common.white,

        '& $icon': {
          fill: theme.palette.primary.main
        }
      }
    },
    icon: {
      minWidth: `${theme.spacing(4)}px`
    }
  })
)

interface Props {
  item: Item
  onClick: (item: Item) => void
}

export default function MenuItem({ item, onClick }: Props) {
  const classes = useStyles()

  const handleClick = () => {
    onClick(item)
  }

  return (
    <ListItem
      button
      dense
      disableGutters
      classes={{ button: classes.itemButton }}
      onClick={handleClick}
    >
      <ListItemIcon className={classes.icon}>
        <item.Icon />
      </ListItemIcon>
      <ListItemText primary={item.title} />
    </ListItem>
  )
}
