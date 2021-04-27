import { Box, makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: {
      backgroundColor: theme.palette.common.white,
      height: theme.spacing(8),
      borderRadius: theme.spacing(0.5)
    }
  }),
  { name: 'ShowingDetailTabBookingsListEmptyState' }
)

interface ShowingDetailTabBookingsListEmptyStateProps {
  message: string
}

function ShowingDetailTabBookingsListEmptyState({
  message
}: ShowingDetailTabBookingsListEmptyStateProps) {
  const classes = useStyles()

  return (
    <Box
      className={classes.root}
      color="grey.500"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="body1">{message}</Typography>
    </Box>
  )
}

export default ShowingDetailTabBookingsListEmptyState
