import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

export const useStyles = makeStyles((theme: Theme) => ({
  button: {
    marginLeft: theme.spacing(2)
  },
  buttonIcon: { margin: theme.spacing(0.5, 1) },
  listItem: { padding: theme.spacing(1, 0.5) },
  listIcon: { marginRight: theme.spacing(2) },
  popover: {
    '& div.MuiPaper-root': {
      marginTop: theme.spacing(1),
      backgroundColor: 'rgb(117 117 117)',
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
  }
}))

export default useStyles
