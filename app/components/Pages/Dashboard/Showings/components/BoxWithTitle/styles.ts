import { makeStyles } from '@material-ui/core'

export default makeStyles(
  theme => ({
    bullet: {
      display: 'inline-block',
      width: theme.spacing(1),
      height: theme.spacing(1),
      marginRight: theme.spacing(1),
      backgroundColor: theme.palette.success.main,
      borderRadius: '50%',
      verticalAlign: 'middle'
    }
  }),
  { name: 'BoxWithTitle' }
)
