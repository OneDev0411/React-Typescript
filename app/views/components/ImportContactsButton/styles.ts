import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

export const useStyles = makeStyles((theme: Theme) => ({
  button: {
    height: '42px'
  },
  buttonIcon: { margin: theme.spacing(0.5, 1) },
  listItem: { padding: theme.spacing(1, 0.5) },
  listIcon: { marginRight: theme.spacing(2) },
  popover: {
    '& div.MuiPaper-root': {
      marginTop: theme.spacing(1),
      backgroundColor: theme.palette.grey[600],
      color: '#fff'
    },
    '& p': {
      margin: 0,
      textAlign: 'center'
    }
  },
  accountsSectionTitle: {
    padding: theme.spacing(2),
    marginBottom: 0
  },
  menuCSVItem: {
    '&:hover': {
      color: 'currentcolor'
    }
  },
  fullWidth: {
    width: '100%'
  }
}))

export default useStyles
