import { makeStyles } from '@material-ui/core'

export default makeStyles(
  theme => ({
    root: { ...theme.typography.body3 },
    green: {},
    orange: {},
    red: {},
    black: {},
    text: {
      '&$green': { color: theme.palette.success.main },
      '&$orange': { color: theme.palette.warning.main },
      '&$red': { color: theme.palette.error.main },
      '&$black': { color: theme.palette.text.primary }
    },
    contained: {
      color: theme.palette.common.white,
      lineHeight: `${theme.spacing(3)}px`,
      display: 'inline-block',
      borderRadius: theme.spacing(3),
      padding: theme.spacing(0, 0.5),
      '&$green': { backgroundColor: theme.palette.success.main },
      '&$orange': { backgroundColor: theme.palette.warning.main },
      '&$red': { backgroundColor: theme.palette.error.main },
      '&$black': { backgroundColor: theme.palette.text.primary }
    }
  }),
  { name: 'Chip' }
)
