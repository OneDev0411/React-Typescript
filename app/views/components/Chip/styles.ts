import { makeStyles } from '@material-ui/core'

export default makeStyles(
  theme => ({
    root: { ...theme.typography.body3 },
    green: { color: theme.palette.success.main },
    orange: { color: theme.palette.warning.main },
    red: { color: theme.palette.error.main },
    black: { color: theme.palette.text.primary }
  }),
  { name: 'Chip' }
)
