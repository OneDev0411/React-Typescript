import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { browserHistory } from 'react-router'

const Form = ({
  deal,
  task,
  isBackOffice
}) => {
  if (isBackOffice || !task || !task.form) {
    return false
  }

  const { submission } = task
  const attachments = submission && submission.state === 'Fair' ? [task.id] : []

  return (
    <div className="file">
      <div className="title">Digital Form</div>
      <div className="item digital-form">
        <div className="image">
          <img src="/static/images/deals/digital-form.svg" />
        </div>

        <div
          className="name"
          onClick={() => browserHistory.push(`/dashboard/deals/${deal.id}/form-viewer/${task.id}`)}
        >
          <span className="link">
            { task.title }
          </span>
        </div>
      </div>
    </div>
  )
}

export default connect(({ deals }) => ({
  isBackOffice: deals.backoffice
}))(Form)
