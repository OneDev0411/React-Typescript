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
      minWidth: '10rem',
      '&:hover': {
        backgroundColor: theme.palette.action.hover
      }
    },
    sharp: {
      borderRadius: 0
    },
    leftRounded: {
      borderRadius: theme.spacing(2, 0, 0, 2) // hokme-hokoomati
    },
    rightRounded: {
      borderRadius: theme.spacing(0, 2, 2, 0)
    }
  })
)
