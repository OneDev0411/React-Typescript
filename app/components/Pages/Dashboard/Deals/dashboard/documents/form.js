import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { editForm } from '../../../../../../store_actions/deals/forms'
import ESignButton from '../esign/button'

const Form = ({
  task,
  editForm
}) => {
  if (!task || !task.form) {
    return false
  }

  const { submission } = task
  const attachments = submission && submission.state === 'Fair' ? [task.id] : []

  return (
    <div className="file">
      <div className="title">Digital Form</div>
      <div className="file-group">
        <Row className="item digital-form">
          <Col sm={1} xs={12} className="image vcenter">
            <img src="/static/images/deals/digital-form.svg" />
          </Col>

          <Col sm={5} xs={12} className="name vcenter">
            <div>Digital Form</div>
          </Col>

          <Col sm={6} xs={12} className="actions vcenter">
            <ESignButton
              dealId={task.deal}
              task={task}
              attachments={attachments}
            />
            <button className="btn-deal" onClick={() => editForm(task)}>Edit</button>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default connect(null, { editForm })(Form)
