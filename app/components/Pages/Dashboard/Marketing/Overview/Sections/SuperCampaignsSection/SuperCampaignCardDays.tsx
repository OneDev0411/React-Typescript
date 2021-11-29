import { makeStyles, Tooltip, Typography } from '@material-ui/core'
import classNames from 'classnames'
import { differenceInDays, format } from 'date-fns'

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

  const needsMoreAttention =
    differenceInDays(time * 1000, new Date().getTime()) <= 3

  const timeInMilliseconds = time * 1000

  const tooltipTitle = format(timeInMilliseconds, "LLLL dd, yyyy 'at' hh:mmaaa")

  return (
    <Typography
      className={classNames(
        classes.root,
        needsMoreAttention && classes.red,
        className
      )}
      variant="caption"
    >
      <Tooltip title={tooltipTitle}>
        <span>
          <RelativeTime time={timeInMilliseconds} />
        </span>
      </Tooltip>
    </Typography>
  )
}

export default SuperCampaignCardDays
