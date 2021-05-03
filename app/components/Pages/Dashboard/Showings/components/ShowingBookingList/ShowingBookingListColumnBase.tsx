import { ReactNode } from 'react'
import { Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: { color: theme.palette.grey[900] }
  }),
  { name: 'ShowingBookingListColumnBase' }
)

interface ShowingBookingListColumnBaseProps {
  children: ReactNode
}

function ShowingBookingListColumnBase({
  children
}: ShowingBookingListColumnBaseProps) {
  const classes = useStyles()

  return (
    <Typography className={classes.root} variant="body2">
      {children}
    </Typography>
  )
}

export default ShowingBookingListColumnBase
