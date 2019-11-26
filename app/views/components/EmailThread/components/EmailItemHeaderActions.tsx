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
  Theme,
  Tooltip
} from '@material-ui/core'

import { useMenu } from 'hooks/use-menu'

import { ClassesProps } from 'utils/ts-utils'

import IconReply from '../../SvgIcons/Reply/IconReply'
import IconReplyAll from '../../SvgIcons/ReplyAll/IconReplyAll'
import IconForward from '../../SvgIcons/Forward/IconForward'
import IconVerticalDocs from '../../SvgIcons/VeriticalDots/VerticalDotsIcon'
import { iconSizes } from '../../SvgIcons/icon-sizes'

interface Props {
  email: IEmailThreadEmail
  onReply: () => void
  onReplyAll: () => void
  onForward: () => void
}

const styles = (theme: Theme) =>
  createStyles({
    menu: {
      minWidth: '15rem'
    }
  })

const useStyles = makeStyles(styles, {
  name: 'EmailActionsMenu'
})

export function EmailItemHeaderActions(
  props: Props & ClassesProps<typeof styles>
) {
  const { menuProps, buttonTriggerProps, onClose } = useMenu()

  const classes = useStyles(props)

  const select = action => () => {
    onClose()
    // to ensure action is run when menu is closed. This ensures autofocus
    // behavior isn't broken in any content that is toggled into view as a
    // result of running this action
    setTimeout(action)
  }

  return (
    <Box ml={1} onClick={e => e.stopPropagation()}>
      <Tooltip title="Reply">
        <IconButton onClick={props.onReply}>
          <IconReply size={iconSizes.small} />
        </IconButton>
      </Tooltip>
      <Tooltip title="More">
        <IconButton {...buttonTriggerProps}>
          <IconVerticalDocs
            size={iconSizes.small}
            style={{ fill: 'currentColor' }}
          />
        </IconButton>
      </Tooltip>
      <Menu
        {...menuProps}
        classes={{ paper: classes.menu }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem dense onClick={select(props.onReply)}>
          <ListItemIcon>
            <IconReply size={iconSizes.small} />
          </ListItemIcon>
          <ListItemText>Reply</ListItemText>
        </MenuItem>
        <MenuItem dense onClick={select(props.onReplyAll)}>
          <ListItemIcon>
            <IconReplyAll size={iconSizes.small} />
          </ListItemIcon>
          <ListItemText>Reply All</ListItemText>
        </MenuItem>
        <MenuItem dense onClick={select(props.onForward)}>
          <ListItemIcon>
            <IconForward size={iconSizes.small} />
          </ListItemIcon>
          <ListItemText>Forward</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}
