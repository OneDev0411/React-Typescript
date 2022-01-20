import { ReactNode } from 'react'

import { makeStyles, Tooltip } from '@material-ui/core'
import classNames from 'classnames'
import { differenceInDays, format } from 'date-fns'

import iff from '@app/utils/iff'
import { RelativeTime } from '@app/views/components/RelativeTime'

const useStyles = makeStyles(
  theme => ({
    red: { color: theme.palette.error.main }
  }),
  { name: 'SuperCampaignSendTime' }
)

interface SuperCampaignSendTimeProps {
  className?: string
  time: number
  hasTooltip?: boolean
  prefix?: ReactNode
}

function SuperCampaignSendTime({
  className,
  time,
  hasTooltip = false,
  prefix
}: SuperCampaignSendTimeProps) {
  const classes = useStyles()

  const daysDiff = differenceInDays(time * 1000, new Date().getTime())
  const needsMoreAttention = daysDiff >= 0 && daysDiff <= 3

  const timeInMilliseconds = time * 1000

  const relativeTime = (
    <span
      className={classNames(iff(needsMoreAttention, classes.red), className)}
    >
      {prefix}
      <RelativeTime time={timeInMilliseconds} />
    </span>
  )

  if (!hasTooltip) {
    return relativeTime
  }

  const tooltipTitle = format(timeInMilliseconds, "LLLL dd, yyyy 'at' hh:mmaaa")

  return <Tooltip title={tooltipTitle}>{relativeTime}</Tooltip>
}

export default SuperCampaignSendTime
