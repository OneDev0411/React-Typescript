import React from 'react'
import {
  Theme,
  makeStyles,
  createStyles,
  Popover,
  List
} from '@material-ui/core'

import { Item } from './types'
import MenuItem from './MenuItem'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    itemsWrapper: {
      margin: theme.spacing(1)
    }
  })
)

interface Props {
  items: Item[]
  anchorEl: HTMLElement | null
  onItemClick: (item: Item) => void
  onClose: () => void
}

export default function Menu({ items, anchorEl, onItemClick, onClose }: Props) {
  const classes = useStyles()
  const open = Boolean(anchorEl)

  const handleItemClick = (item: Item) => {
    onItemClick(item)
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      transitionDuration={0}
    >
      <List dense>
        <div className={classes.itemsWrapper}>
          {items.map((item, index) => (
            <MenuItem key={index} item={item} onClick={handleItemClick} />
          ))}
        </div>
      </List>
    </Popover>
  )
}
