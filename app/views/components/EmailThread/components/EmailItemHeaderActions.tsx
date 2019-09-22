import * as React from 'react'
import {
  Box,
  createStyles,
  IconButton,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  Theme
} from '@material-ui/core'

import { useMenu } from 'hooks/use-menu'

import { ClassesProps } from 'utils/ts-utils'

import IconReply from '../../SvgIcons/Reply/IconReply'
import IconForward from '../../SvgIcons/Forward/IconForward'
import IconVerticalDocs from '../../SvgIcons/VeriticalDots/VerticalDotsIcon'
import { iconSizes } from '../../SvgIcons/icon-sizes'

interface Props {
  onReply: () => void
  onForward: () => void
}

const styles = (theme: Theme) =>
  createStyles({
    menu: {
      minWidth: '20rem'
    }
  })

const useStyles = makeStyles(styles, {
  name: 'EmailActionsMenu'
})

export function EmailItemHeaderActions(
  props: Props & ClassesProps<typeof styles>
) {
  const { menuProps, triggerProps, onClose } = useMenu()

  const classes = useStyles(props)

  const select = action => () => {
    action()
    onClose()
  }

  return (
    <Box ml={1}>
      <IconButton onClick={props.onReply}>
        <IconReply size={iconSizes.small} />
      </IconButton>
      <IconButton {...triggerProps}>
        <IconVerticalDocs
          size={iconSizes.small}
          style={{ fill: 'currentColor' }}
        />
      </IconButton>
      <Menu
        {...menuProps}
        classes={{ paper: classes.menu }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem onClick={select(props.onReply)}>
          <ListItemIcon>
            <IconReply size={iconSizes.small} />
          </ListItemIcon>
          <ListItemText>Reply</ListItemText>
        </MenuItem>
        <MenuItem onClick={select(props.onForward)}>
          <ListItemIcon>
            <IconForward size={iconSizes.small} />
          </ListItemIcon>
          <ListItemText>Forward</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}
