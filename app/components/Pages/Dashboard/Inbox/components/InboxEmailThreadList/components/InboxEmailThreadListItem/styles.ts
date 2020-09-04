import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

export const useInboxEmailThreadListItemStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      width: 'calc(100% + 0.5em)' /* scroll bar */,
      display: 'flex',
      alignItems: 'flex-start'
    },
    status: {
      width: theme.spacing(1),
      height: theme.spacing(1),
      borderRadius: theme.spacing(0.5),
      margin: theme.spacing(2)
    },
    statusUnread: {
      backgroundColor: theme.palette.info.main
    },
    info: {
      width: 0,
      flexGrow: 1,
      padding: theme.spacing(1.5, 0),
      paddingRight: theme.spacing(3) /* 1 unit (=0.5em) for scroll bar */,
      '&:hover': {
        '& $date': {
          display: 'none'
        }
      },
      '&:not(:hover)': {
        '& $actions': {
          display: 'none'
        }
      }
    },
    infoRead: {
      backgroundColor: theme.palette.grey[50]
    },
    infoSelected: {
      backgroundColor: theme.palette.action.selected
    },
    recipients: {
      color: theme.palette.common.black
    },
    recipientsRead: {
      color: theme.palette.grey[600]
    },
    date: {
      color: theme.palette.grey[500]
    },
    dateUnread: {
      color: theme.palette.common.black,
      fontWeight: 700
    },
    actions: {
      height: 0,
      flex: '0 0 auto',
      position: 'relative',
      top: theme.spacing(-1.5),
      right: theme.spacing(-1)
    },
    action: {
      '& svg': {
        color: theme.palette.grey[600]
      },
      '&:hover:not($actionDisabled) svg': {
        color: theme.palette.common.black
      }
    },
    actionDisabled: {
      '& svg': {
        color: theme.palette.grey[400]
      }
    },
    subject: {
      color: theme.palette.common.black
    },
    subjectRead: {
      color: theme.palette.grey[600]
    },
    snippet: {
      color: theme.palette.common.black
    },
    snippetRead: {
      color: theme.palette.grey[400]
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
