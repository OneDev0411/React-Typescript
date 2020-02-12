import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dropdownButton: {
      backgroundColor: '#F2F3F7', // TODO: change
      borderRadius: 0,
      margin: theme.spacing(0, 0, 0, 0.5),
      color: theme.palette.common.black
    },
    button: {
      minWidth: '7rem',
      fontSize: theme.typography.body1.fontSize,
      fontWeight: theme.typography.fontWeightBlack
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
