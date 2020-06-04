import React from 'react'
import cn from 'classnames'
import {
  Theme,
  makeStyles,
  createStyles,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'

import AddIcon from 'components/SvgIcons/Add/AddIcon'

import { useIconStyles } from '../../../styles/use-icon-styles'
import { Item } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    itemButton: {
      fontSize: theme.typography.body1.fontSize,
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(1),
      height: theme.spacing(5),

      '&:hover': {
        color: theme.palette.primary.main,

        '& $icon, $addIcon': {
          fill: theme.palette.primary.main
        },

        '& $addIcon': {
          visibility: 'visible'
        }
      }
    },
    icon: {
      minWidth: `${theme.spacing(3)}px !important`
    },
    addIcon: {
      visibility: 'hidden'
    }
  })
)

interface Props {
  item: Item
  onClick: (item: Item) => void
}

export default function MenuItem({ item, onClick }: Props) {
  const classes = useStyles()
  const iconClasses = useIconStyles()

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
        <item.Icon className={iconClasses.small} />
      </ListItemIcon>
      <ListItemText primary={item.title} />
      <ListItemIcon
        className={cn(
          iconClasses.small,
          iconClasses.leftMargin,
          classes.icon,
          classes.addIcon
        )}
      >
        <AddIcon />
      </ListItemIcon>
    </ListItem>
  )
}
