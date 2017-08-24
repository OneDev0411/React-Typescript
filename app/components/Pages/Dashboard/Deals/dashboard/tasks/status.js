import React from 'react'
import { connect } from 'react-redux'

const TaskStatus = ({
  task,
  isBackoffice
}) => {
  let status = task.review ? task.review.status : 'Incomplete'

  if (isBackoffice && (status === 'Submitted' || task.needs_attention)) {
    status = 'NEEDS ATTENTION'
  }

  return (
    <span className={`status ${status}`}>
      { status.toUpperCase() }
    </span>
  )
}

export default connect(({ deals }) => ({
  isBackoffice: deals.backoffice
}))(TaskStatus)
