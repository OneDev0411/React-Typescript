import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Form from './digital-form'
import Attachments from './attachments'
import Envelopes from './esigns'

export default ({
  deal,
  task
}) => (
  <div className="deal-files-container">
    <Form
      deal={deal}
      task={task}
    />

    <Envelopes
      deal={deal}
      task={task}
    />

    <Attachments
      deal={deal}
      task={task}
    />
  </div>
)
