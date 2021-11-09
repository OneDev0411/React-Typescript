import { makeStyles, Typography } from '@material-ui/core'
import classNames from 'classnames'
import { differenceInDays } from 'date-fns'

import { RelativeTime } from '@app/views/components/RelativeTime'

const useStyles = makeStyles(
  theme => ({
    root: { color: theme.palette.grey[500] },
    red: { color: theme.palette.error.main }
  }),
  { name: 'SuperCampaignCardDays' }
)

interface SuperCampaignCardDaysProps {
  className: string
  time: number
}

function SuperCampaignCardDays({
  className,
  time
}: SuperCampaignCardDaysProps) {
  const classes = useStyles()

  const needsMoreAttention = differenceInDays(time, new Date().getTime()) <= 3

  return (
    <Typography
      className={classNames(
        classes.root,
        needsMoreAttention && classes.red,
        className
      )}
      variant="caption"
    >
      <RelativeTime time={time} />
    </Typography>
  )
}

export default SuperCampaignCardDays
