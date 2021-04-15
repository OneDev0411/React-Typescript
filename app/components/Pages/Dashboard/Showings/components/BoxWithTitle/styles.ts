import { makeStyles } from '@material-ui/core'

export default makeStyles(
  theme => ({
    title: { display: 'inline-block' },
    link: {
      ...theme.typography.body1,
      color: theme.palette.secondary.main,
      display: 'inline-flex',
      alignItems: 'center',
      marginLeft: theme.spacing(2)
    },
    icon: {
      fontSize: theme.spacing(2),
      marginLeft: theme.spacing(0.5)
    }
  }),
  { name: 'BoxWithTitle' }
)
