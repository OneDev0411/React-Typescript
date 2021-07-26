import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'block',
      width: theme.spacing(1),
      height: theme.spacing(1),
      backgroundColor: theme.palette.error.main,
      borderRadius: '50%'
    }
  }),
  { name: 'ShowingBookingListColumnNew' }
)

interface ShowingBookingListColumnNewProps {
  isNew: boolean
}

function ShowingBookingListColumnNew({
  isNew
}: ShowingBookingListColumnNewProps) {
  const classes = useStyles()

  return isNew ? <div className={classes.root} /> : null
}

export default ShowingBookingListColumnNew
