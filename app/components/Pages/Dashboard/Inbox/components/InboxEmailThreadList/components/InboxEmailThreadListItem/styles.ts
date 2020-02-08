import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

export const useInboxEmailThreadListItemStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      width: '100%',
      padding: theme.spacing(2, 3, 2, 2.5),
      borderLeft: `4px solid ${theme.palette.common.white}`
    },
    selected: {
      borderLeftColor: theme.palette.primary.main,
      backgroundColor: `${theme.palette.primary.main}1F`
    },
    status: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginTop: 8
    },
    unread: {
      backgroundColor: theme.palette.primary.main
    },
    info: {
      maxWidth: 'calc(100% - 25px)'
    },
    infoText: {
      lineHeight: '24px'
    },
    message: {
      maxHeight: '3rem',
      overflow: 'hidden'
    },
    flex: {
      display: 'flex'
    },
    grow: {
      flexGrow: 1
    },
    bold: {
      fontWeight: 'bold'
    },
    oneLineEllipsis: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }),
  { name: 'InboxEmailThreadListItem' }
)
