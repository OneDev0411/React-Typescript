import { Typography } from '@material-ui/core'
import moment from 'moment'

import { isEmailInProgress } from '../../helpers/is-email-in-progress'
import { isEmailScheduled } from '../../helpers/is-email-scheduled'

interface Props {
  item: IEmailCampaign<'template'>
}

export function DateColumn({ item }: Props) {
  const isScheduled = isEmailScheduled(item)
  const isInProgress = isEmailInProgress(item)

  let date = '-'

  if (isScheduled || isInProgress) {
    date = moment.unix(item.due_at).format('MMM D, YYYY hh:mm A')
  }

  if (item.executed_at) {
    date = moment.unix(item.executed_at).format('MMM D, YYYY hh:mm A')
  }

  return (
    <Typography variant="caption" color="textSecondary">
      {isScheduled ? `Scheduled for ${date}` : date}
    </Typography>
  )
}
