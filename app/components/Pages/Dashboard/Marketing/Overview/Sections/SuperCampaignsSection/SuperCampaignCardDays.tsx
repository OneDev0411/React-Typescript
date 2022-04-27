import { makeStyles, Typography } from '@material-ui/core'
import classNames from 'classnames'

import RelativeSendTime from '@app/views/components/RelativeSendTime'

const useStyles = makeStyles(
  theme => ({
    root: { color: theme.palette.grey[500] }
  }),
  { name: 'SuperCampaignCardDays' }
)

interface SuperCampaignCardDaysProps {
  className?: string
  time: number
}

function SuperCampaignCardDays({
  className,
  time
}: SuperCampaignCardDaysProps) {
  const classes = useStyles()

  return (
    <Typography
      className={classNames(classes.root, className)}
      variant="caption"
    >
      <RelativeSendTime time={time} hasTooltip />
    </Typography>
  )
}

export default SuperCampaignCardDays
