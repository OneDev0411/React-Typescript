import { Box, makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: {
      backgroundColor: theme.palette.grey[50],
      height: theme.spacing(8),
      borderRadius: theme.spacing(0.5)
    }
  }),
  { name: 'ShowingBookingListEmptyState' }
)

interface ShowingBookingListEmptyStateProps {
  message: string
}

function ShowingBookingListEmptyState({
  message
}: ShowingBookingListEmptyStateProps) {
  const classes = useStyles()

  return (
    <Box className={classes.root} display="flex" alignItems="center" px={2}>
      <Typography variant="body1">{message}</Typography>
    </Box>
  )
}

export default ShowingBookingListEmptyState
