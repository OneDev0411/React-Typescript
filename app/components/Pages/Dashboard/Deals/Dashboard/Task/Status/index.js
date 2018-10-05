import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import ToolTip from 'components/tooltip'
import { isBackOffice } from 'utils/user-teams'

import { Label } from './styled'

function TaskStatus(props) {
  const { task, noTip, isBackoffice, isDraftDeal } = props

  const { review } = task
  let status = null
  let tooltip = null

  if (review) {
    status = review.status

    const { created_at } = review

    const reviewTime = moment.unix(created_at)

    tooltip = 'Status: '
    tooltip += reviewTime.isValid()
      ? `(${status}, ${reviewTime.format('MMMM DD, YY [at] hh:mm A')})`
      : `${status}`
  }

  if (isBackoffice && (status === 'Submitted' || task.attention_requested)) {
    status = 'NEEDS ATTENTION'
  }

  if (!isBackoffice && status !== 'Submitted' && task.attention_requested) {
    status = isDraftDeal ? 'Pending' : 'Notified'
  }

  if (!status) {
    return false
  }

  return (
    <ToolTip caption={noTip !== true && tooltip} placement="bottom">
      <Label className={status}>{status}</Label>
    </ToolTip>
  )
}

export default connect(({ user }) => ({
  isBackoffice: isBackOffice(user)
}))(TaskStatus)
