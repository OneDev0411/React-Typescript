import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import moment from 'moment'
import _ from 'underscore'

export default ({
  task
}) => (
  <Row className="file">
    <Col sm={1} xs={12} className="image vcenter">
      <img src="/static/images/deals/upload.jpg" />
    </Col>
    <Col sm={11} xs={12} className="name vcenter">
      <div>Drag and Drop</div>
      <div>your files to upload</div>
    </Col>

  </Row>
)
