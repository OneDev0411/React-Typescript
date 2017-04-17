
import React from 'react'
import { Row, Col } from 'react-bootstrap'


export default ({
  title
}) => (
  <Row>
    <Col xs={12}>
      <h2 className="c-concierge__list-title">
        {title}
      </h2>
    </Col>
  </Row>
)