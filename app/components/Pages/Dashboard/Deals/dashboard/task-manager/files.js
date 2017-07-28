import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'

const Comment = () => {

  return (
    <div className="deal-files">
      <Row className="file">
        <Col sm={1} xs={1}>ICON</Col>
        <Col sm={5} xs={5}>
          <div>[ name ]</div>
          <div>[ description ]</div>
        </Col>

        <Col sm={6} xs={6}>
          [[ Actions ]]
        </Col>
      </Row>

      <Row className="file">
        <Col sm={1} xs={1}>ICON</Col>
        <Col sm={5} xs={5}>
          <div>[ name ]</div>
          <div>[ description ]</div>
        </Col>

        <Col sm={6} xs={6}>
          [[ Actions ]]
        </Col>
      </Row>

    </div>
  )
}

export default Comment
