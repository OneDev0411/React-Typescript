import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import ToolTip from '../../../../../../views/components/tooltip/index'
import { isBackOffice } from '../../../../../../utils/user-teams'

const TaskStatus = ({ task, noTip, isBackoffice, isDraft }) => {
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
    status = isDraft ? 'Pending' : 'Notified'
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

export default connect(({ user }) => ({
  isBackoffice: isBackOffice(user)
}))(TaskStatus)
