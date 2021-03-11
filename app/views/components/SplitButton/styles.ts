import { makeStyles } from '@material-ui/core'

export default makeStyles(
  theme => ({
    mainButton: { flex: 1 },
    smallArrow: {
      paddingLeft: 0,
      paddingRight: 0,
      minWidth: theme.spacing(3)
    }
  }),
  { name: 'SplitButton' }
)
