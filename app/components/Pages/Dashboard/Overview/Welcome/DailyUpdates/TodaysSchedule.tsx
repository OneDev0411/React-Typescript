import { Box } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

export default function TodaysSchedule() {
  const zeroState = (
    <Box display="flex" alignItems="center" justifyContent="center" height={1}>
      <Typography variant="body1">You're all caught up for today!</Typography>
    </Box>
  )

  return <>{zeroState}</>
}
