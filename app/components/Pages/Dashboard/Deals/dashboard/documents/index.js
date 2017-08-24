import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Form from './form'
import Attachments from './attachments'
import UploadFile from './upload'
import Envelopes from './esigns'

export default ({
  deal,
  task
}) => (
  <div className="deal-files-container">
    <Form
      task={task}
    />

    <Envelopes
      deal={deal}
      task={task}
    />

    <Attachments
      task={task}
    />
  </div>
)
