import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

export const useInboxEmailThreadListItemStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      width: 'calc(100% + 0.5em)' /* scroll bar */,
      padding: theme.spacing(2),
      paddingRight: `calc(${theme.spacing(2)}px + 0.5em)` /* scroll bar */
    },
    selected: {
      backgroundColor: `${theme.palette.action.selected}`
    },
    status: {
      width: theme.spacing(1),
      height: theme.spacing(1),
      borderRadius: theme.spacing(0.5),
      marginTop: theme.spacing(0.75),
      marginRight: theme.spacing(2)
    },
    statusUnread: {
      backgroundColor: theme.palette.secondary.main
    },
    info: {
      maxWidth: 'calc(100% - 25px)'
    },
    recipients: {
      color: theme.palette.common.black
    },
    date: {
      color: theme.palette.grey[500]
    },
    subject: {
      color: theme.palette.common.black
    },
    snippet: {
      maxHeight: '2.86em' /* 2x body2 line-height */,
      overflow: 'hidden',
      color: theme.palette.common.black
    },
    snippetUnselectedRead: {
      color: theme.palette.grey[500]
    },
    flex: {
      display: 'flex'
    },
    grow: {
      flexGrow: 1
    }
  }),
  { name: 'InboxEmailThreadListItem' }
)
