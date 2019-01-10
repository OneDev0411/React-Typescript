import React from 'react'
import moment from 'moment'

import ToolTip from 'components/tooltip'

import { Label } from './styled'

export default function TaskStatus(props) {
  if (!props.task) {
    return false
  }

  let status = null
  let tooltip = null

  if (props.task.review) {
    status = props.task.review.status

    const reviewTime = moment.unix(props.task.review.created_at)

    tooltip = 'Status: '
    tooltip += reviewTime.isValid()
      ? `(${status}, ${reviewTime.format('MMMM DD, YY [at] hh:mm A')})`
      : `${status}`
  }

  if (
    props.isBackOffice &&
    (status === 'Submitted' || props.task.attention_requested)
  ) {
    status = 'NEEDS ATTENTION'
  }

  if (
    !props.isBackOffice &&
    status !== 'Submitted' &&
    props.task.attention_requested
  ) {
    status = props.isDraftDeal ? 'Pending' : 'Notified'
  }

  if (!status) {
    return false
  }

  return (
    <ToolTip caption={props.noTip !== true && tooltip} placement="bottom">
      <Label className={status}>{status}</Label>
    </ToolTip>
  )
}
