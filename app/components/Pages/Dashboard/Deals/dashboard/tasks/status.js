import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

const TaskStatus = ({
  task,
  isBackoffice
}) => {
  let { status } = task.review
  const reviewTime = moment.unix(task.review.created_at).format('MMMM DD, YY [at] HH:mm')

  if (isBackoffice && (status === 'Submitted' || task.needs_attention)) {
    status = 'NEEDS ATTENTION'
  }

  if (!isBackoffice && status !== 'Submitted' && task.needs_attention) {
    status = 'Notified'
  }

  return (
    <span
      className={`status ${status}`}
      data-tip={`${status}, ${reviewTime}`}
      data-place="bottom"
    >
      { status.toUpperCase() }
    </span>
  )
}

export default connect(({ deals }) => ({
  isBackoffice: deals.backoffice
}))(TaskStatus)
