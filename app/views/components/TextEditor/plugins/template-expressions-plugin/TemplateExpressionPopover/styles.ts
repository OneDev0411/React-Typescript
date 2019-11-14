import { createStyles, Theme } from '@material-ui/core'

export const styles = (theme: Theme) =>
  createStyles({
    root: {
      minWidth: '20rem'
    },
    description: {
      padding: theme.spacing(1, 1),
      display: 'flex',
      alignItems: 'center',
      backgroundColor: theme.palette.grey['300'],
      color: theme.palette.text.hint
    },
    inputWrapper: {
      padding: theme.spacing(0, 2)
    }
  })
