import React from 'react'
import {
  Theme,
  makeStyles,
  createStyles,
  Divider,
  Popover,
  List,
  ListSubheader,
  Typography,
  IconButton
} from '@material-ui/core'

import CloseIcon from 'components/SvgIcons/Close/CloseIcon'

import { Item } from './types'
import MenuItem from './MenuItem'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popoverPaper: {
      padding: theme.spacing(0, 2)
    },
    closeIconButtonLabel: {
      width: `${theme.spacing(2)}px`,
      height: `${theme.spacing(2)}px`
    },
    subheader: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(1, 0)
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
      classes={{ paper: classes.popoverPaper }}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
    >
      <List
        dense
        subheader={
          <>
            <ListSubheader disableGutters className={classes.subheader}>
              <Typography variant="caption">Actions</Typography>
              <IconButton
                size="small"
                classes={{ label: classes.closeIconButtonLabel }}
                onClick={onClose}
              >
                <CloseIcon />
              </IconButton>
            </ListSubheader>
            <Divider />
          </>
        }
      >
        {items.map((item, index) => (
          <MenuItem key={index} item={item} onClick={handleItemClick} />
        ))}
      </List>
    </Popover>
  )
}
