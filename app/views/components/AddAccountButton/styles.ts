import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

export const useStyles = makeStyles((theme: Theme) => ({
  button: {
    height: '42px',
    width: '42px',
    minWidth: 'unset'
  },
  buttonIcon: { marginTop: theme.spacing(1) },
  listItem: { padding: theme.spacing(1, 0.5), alignItems: 'center' },
  listIcon: { marginRight: theme.spacing(2) },
  listText: {
    color: theme.palette.text.primary,
    '&:hover': {
      color: theme.palette.secondary.main,
      textDecoration: 'underline',
      textUnderlineOffset: `${theme.spacing(0.5)}px`
    }
  },
  listAction: {
    flex: 1,
    justifyContent: 'flex-end',
    display: 'flex'
  },
  listActionIcon: {
    color: theme.palette.grey[500],
    '&:hover': {
      color: theme.palette.secondary.main
    }
  },
  dropdown: {
    width: 336
  },
  connectedAccounts: {
    backgroundColor: theme.palette.grey[50]
  },
  accountsSectionTitle: {
    padding: theme.spacing(2, 2, 0, 2),
    marginBottom: 0
  },
  menuCSVItem: {
    '&:hover': {
      color: 'currentcolor'
    }
  },
  fullWidth: {
    width: '100%'
  },
  connectedAccount: {
    alignItems: 'center',
    lineHeight: 1.5,
    width: '100%',
    padding: theme.spacing(1, 0)
  },
  connectedAccountAvatar: {
    padding: theme.spacing(1)
  },
  connectedAccountInfo: {
    marginLeft: theme.spacing(1)
  },
  ConnectedAccountSyncStatus: {
    color: theme.palette.grey[600]
  }
}))

export default useStyles
