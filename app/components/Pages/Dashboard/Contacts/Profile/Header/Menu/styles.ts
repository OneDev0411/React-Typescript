import { createStyles, Theme } from '@material-ui/core/styles'

export const styles = (theme: Theme) =>
  createStyles({
    button: {
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2),

      '&[disabled] svg': {
        fill: theme.palette.action.disabled
      }
    },
    leftIcon: {
      marginRight: theme.spacing(1)
    }
  })
