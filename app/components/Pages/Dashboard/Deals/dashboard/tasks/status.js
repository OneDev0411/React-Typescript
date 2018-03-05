import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import ToolTip from '../../components/tooltip'

const TaskStatus = ({ task, noTip, isBackoffice }) => {
  const { review } = task
  let status = null
  let tooltip = null

  if (review) {
    status = review.status

    const { created_at } = review

    let reviewTime = moment.unix(created_at)

    let reviewTimeFormat

    if (reviewTime.isValid()) {
      reviewTimeFormat = reviewTime.format('MMMM DD, YY [at] hh:mm A')
    }

    tooltip = 'Status: '
    tooltip += reviewTimeFormat
      ? `(${status}, ${reviewTimeFormat})`
      : `${status}`
  }

  if (isBackoffice && (status === 'Submitted' || task.attention_requested)) {
    status = 'NEEDS ATTENTION'
  }

  if (!isBackoffice && status !== 'Submitted' && task.attention_requested) {
    status = 'Notified'
  }

  if (!status) {
    return false
  }

  return (
    <ToolTip caption={!noTip && tooltip} placement="bottom">
      <span className={`status ${status}`}>{status.toUpperCase()}</span>
    </ToolTip>
  )
}

export default connect(({ deals }) => ({
  isBackoffice: deals.backoffice
}))(TaskStatus)
