import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

export const useInboxEmailThreadListItemStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      width: 'calc(100% + 0.5em)' /* scroll bar */,
      padding: theme.spacing(1.5, 2),
      paddingRight: `calc(${theme.spacing(2)}px + 0.5em)` /* scroll bar */
    },
    read: {
      backgroundColor: `${theme.palette.grey[50]}`
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
      backgroundColor: theme.palette.info.main
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
    dateUnread: {
      color: theme.palette.common.black,
      fontWeight: 700
    },
    subject: {
      color: theme.palette.common.black
    },
    snippet: {
      color: theme.palette.common.black
    },
    snippetRead: {
      color: theme.palette.grey[600]
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
