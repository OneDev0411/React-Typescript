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
import { useTheme } from '@material-ui/styles'
import classNames from 'classnames'

import {
  mdiDotsVertical,
  mdiReply,
  mdiForward,
  mdiReplyAll,
  mdiEmailOutline,
  mdiEmailOpenOutline
} from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'

import { useMenu } from 'hooks/use-menu'
import useTypedSelector from 'hooks/use-typed-selector'

import { ClassesProps } from 'utils/ts-utils'

import { hasReplyAll } from '../../EmailCompose/helpers/has-reply-all'
import { EmailThreadEmail } from '../types'
import { hasOAuthAccess } from '../helpers/has-oauth-access'

interface Props {
  email: EmailThreadEmail
  onReply: () => void
  onReplyAll: () => void
  onForward: () => void
  onChangeReadStatus: () => void
}

const styles = (theme: Theme) =>
  createStyles({
    menu: {
      minWidth: '15rem'
    },
    disabledMenu: {
      cursor: 'auto',
      color: theme.palette.action.disabled,
      '&:hover': {
        backgroundColor: 'transparent'
      }
    }
  })

const useStyles = makeStyles(styles, {
  name: 'EmailActionsMenu'
})

export function EmailItemHeaderActions(
  props: Props & ClassesProps<typeof styles>
) {
  const { menuProps, buttonTriggerProps, onClose } = useMenu()
  const accounts: IOAuthAccount[] = useTypedSelector(state =>
    selectAllConnectedAccounts(state.contacts.oAuthAccounts)
  )

  const classes = useStyles(props)
  const theme = useTheme<Theme>()

  const hasModifyAccess = hasOAuthAccess(
    accounts,
    props.email.googleId || props.email.microsoftId,
    'mail.modify'
  )

  const select = (action, hasAccess = true) => () => {
    if (!hasAccess) {
      return
    }

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
          <SvgIcon path={mdiReply} color={theme.palette.common.black} />
        </IconButton>
      </Tooltip>
      <Tooltip title="More">
        <IconButton {...buttonTriggerProps}>
          <SvgIcon path={mdiDotsVertical} color={theme.palette.common.black} />
        </IconButton>
      </Tooltip>
      <Menu
        {...menuProps}
        disableScrollLock
        classes={{ paper: classes.menu }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem dense onClick={select(props.onReply)}>
          <ListItemIcon>
            <SvgIcon path={mdiReply} color={theme.palette.common.black} />
          </ListItemIcon>
          <ListItemText>Reply</ListItemText>
        </MenuItem>
        {hasReplyAll(props.email) && (
          <MenuItem dense onClick={select(props.onReplyAll)}>
            <ListItemIcon>
              <SvgIcon path={mdiReplyAll} color={theme.palette.common.black} />
            </ListItemIcon>
            <ListItemText>Reply All</ListItemText>
          </MenuItem>
        )}
        <MenuItem dense onClick={select(props.onForward)}>
          <ListItemIcon>
            <SvgIcon path={mdiForward} color={theme.palette.common.black} />
          </ListItemIcon>
          <ListItemText>Forward</ListItemText>
        </MenuItem>

        <Tooltip
          title={
            hasModifyAccess
              ? ''
              : 'You do not have enough permission to complete this action'
          }
        >
          <MenuItem
            dense
            onClick={select(props.onChangeReadStatus, hasModifyAccess)}
            className={classNames(!hasModifyAccess && classes.disabledMenu)}
          >
            <ListItemIcon>
              {props.email.isRead ? (
                <SvgIcon
                  path={mdiEmailOutline}
                  color={
                    hasModifyAccess ? '#000' : theme.palette.action.disabled
                  }
                />
              ) : (
                <SvgIcon
                  path={mdiEmailOpenOutline}
                  color={
                    hasModifyAccess ? '#000' : theme.palette.action.disabled
                  }
                />
              )}
            </ListItemIcon>
            <ListItemText>
              Mark as {props.email.isRead ? 'unread' : 'read'}
            </ListItemText>
          </MenuItem>
        </Tooltip>
      </Menu>
    </Box>
  )
}
