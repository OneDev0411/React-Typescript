import { Typography, makeStyles } from '@material-ui/core'
import { format } from 'date-fns'

import { RelativeTime } from '@app/views/components/RelativeTime'

const useStyles = makeStyles(
  theme => ({
    root: {
      color: theme.palette.grey[500],
      flexGrow: 1,
      flexShrink: 1
    }
  }),
  { name: 'SuperCampaignPreviewDrawerScheduledFor' }
)

interface SuperCampaignPreviewDrawerScheduledForProps {
  time: Nullable<number>
}

function SuperCampaignPreviewDrawerScheduledFor({
  time
}: SuperCampaignPreviewDrawerScheduledForProps) {
  const classes = useStyles()

  if (!time) {
    return <span className={classes.root} />
  }

  const timeInMilliseconds = time * 1000

  return (
    <Typography className={classes.root} variant="body2">
      Scheduled to send <RelativeTime time={timeInMilliseconds} /> (
      {format(timeInMilliseconds, "LLLL dd, yyyy 'at' hh:mmaaa")})
    </Typography>
  )
}

export default SuperCampaignPreviewDrawerScheduledFor
