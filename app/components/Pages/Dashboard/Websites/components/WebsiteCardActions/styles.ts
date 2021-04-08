import { makeStyles } from '@material-ui/core'

export default makeStyles(
  theme => ({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(1, 2)
    },
    button: {
      marginRight: theme.spacing(1)
    },
    linkButton: {
      color: `${theme.palette.common.white} !important`
    },
    transparentButton: {
      backgroundColor: theme.palette.action.active
    }
  }),
  { name: 'WebsiteCardActions' }
)
