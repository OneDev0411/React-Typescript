
import React from 'react'
import { Row, Col } from 'react-bootstrap'


export default ({
  title
}) => (
  <Row>
    <Col xs={12}>
      <h2
        style={{
          fontSize: '31px',
          fontWeight: 300,
          lineHeight: 1,
          color: '#5e676c'
        }}
      >
        {title}
      </h2>
    </Col>
  </Row>
)