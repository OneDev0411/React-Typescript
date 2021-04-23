import { ReactNode } from 'react'
import { Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: { color: theme.palette.grey[900] }
  }),
  { name: 'ShowingDetailTabBookingsListColumnBase' }
)

interface ShowingDetailTabBookingsListColumnBaseProps {
  children: ReactNode
}

function ShowingDetailTabBookingsListColumnBase({
  children
}: ShowingDetailTabBookingsListColumnBaseProps) {
  const classes = useStyles()

  return (
    <Typography className={classes.root} variant="body2">
      {children}
    </Typography>
  )
}

export default ShowingDetailTabBookingsListColumnBase
