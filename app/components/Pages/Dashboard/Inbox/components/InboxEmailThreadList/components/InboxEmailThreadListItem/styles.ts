import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

export const useInboxEmailThreadListItemStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      width: '100%',
      padding: theme.spacing(2, 2, 2, 0.75)
    },
    selected: {
      backgroundColor: `${theme.palette.action.selected}`
    },
    status: {
      width: theme.spacing(1),
      height: theme.spacing(1),
      borderRadius: theme.spacing(0.5),
      marginTop: theme.spacing(0.75),
      marginRight: theme.spacing(0.75)
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
      color: theme.palette.action.disabled
    },
    subject: {
      color: theme.palette.common.black
    },
    message: {
      maxHeight: '2.86em' /* 2x body2 line-height */,
      overflow: 'hidden',
      color: theme.palette.common.black
    },
    messageRead: {
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
