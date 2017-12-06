import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import ToolTip from '../../components/tooltip'

const TaskStatus = ({
  task,
  noTip,
  isBackoffice
}) => {
  const { review } = task
  let status = null
  let reviewTime = null
  let tooltip = null

  if (review) {
    status = review.status
    reviewTime = moment.unix(review.created_at).format('MMMM DD, YY [at] HH:mm')
    tooltip = `Status: (${status}, ${reviewTime})`
  }

  if (isBackoffice && (status === 'Submitted' || task.needs_attention)) {
    status = 'NEEDS ATTENTION'
  }

  if (!isBackoffice && status !== 'Submitted' && task.needs_attention) {
    status = 'Notified'
  }

  if (!status) {
    return false
  }

  return (
    <ToolTip
      caption={!noTip && tooltip}
      placement="bottom"
    >
      <span
        className={`status ${status}`}
      >
        { status.toUpperCase() }
      </span>
    </ToolTip>
  )
}

export default connect(({ deals }) => ({
  isBackoffice: deals.backoffice
}))(TaskStatus)
