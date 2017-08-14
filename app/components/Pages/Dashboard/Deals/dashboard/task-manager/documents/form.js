import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { editForm } from '../../../../../../../store_actions/deals/forms'


const Form = ({
  task,
  editForm
}) => {
  if (!task || !task.form) {
    return false
  }

  return (
    <div className="file">
      <div className="title">Digital Form</div>
      <div className="file-group">
        <Row className="item digital-form">
          <Col sm={1} xs={12} className="image vcenter">
            <img src="/static/images/deals/form.png" />
          </Col>

          <Col sm={5} xs={12} className="name vcenter">
            <div>Digital Form</div>
          </Col>

          <Col sm={6} xs={12} className="actions vcenter">
            <button>eSigns</button>
            <button onClick={() => editForm(task)}>Edit</button>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default connect(null, { editForm })(Form)
