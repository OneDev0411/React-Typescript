import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

const TaskStatus = ({
  task,
  isBackoffice
}) => {
  const { review } = task
  let status = null
  let reviewTime = null
  let tooltip = null

  if (review) {
    status = review.status
    reviewTime = moment.unix(review.created_at).format('MMMM DD, YY [at] HH:mm')
    tooltip = `${status}, ${reviewTime}`
  }

  if (isBackoffice && (status === 'Submitted' || task.needs_attention)) {
    status = 'NEEDS ATTENTION'
  }

  if (!isBackoffice && status !== 'Submitted' && task.needs_attention) {
    status = 'Notified'
  }

  return (
    <span
      className={`status ${status}`}
      data-tip={tooltip}
      data-place="bottom"
    >
      { status.toUpperCase() }
    </span>
  )
}

export default connect(({ deals }) => ({
  isBackoffice: deals.backoffice
}))(TaskStatus)
