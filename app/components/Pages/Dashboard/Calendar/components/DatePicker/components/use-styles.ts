import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dropdownButton: {
      backgroundColor: theme.palette.grey[100],
      borderRadius: 0,
      margin: theme.spacing(0, 0, 0, 0.25),
      color: theme.palette.common.black
    },
    button: {
      minWidth: '7rem',
      '&:hover': {
        backgroundColor: theme.palette.action.hover
      }
    },
    sharp: {
      borderRadius: 0
    },
    leftRounded: {
      borderRadius: theme.spacing(
        theme.shape.borderRadius,
        0,
        0,
        theme.shape.borderRadius
      )
    },
    rightRounded: {
      borderRadius: theme.spacing(
        0,
        theme.shape.borderRadius,
        theme.shape.borderRadius,
        0
      )
    }
  })
)
