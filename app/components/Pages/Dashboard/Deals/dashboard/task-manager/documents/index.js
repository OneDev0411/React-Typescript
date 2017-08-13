import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Form from './form'
import Attachments from './attachments'
import UploadFile from './upload'

export default ({
  task
}) => (
  <div className="deal-files-container">

    <div className="deal-documents">
      <Form task={task} />
      <Attachments task={task} />
    </div>

    <UploadFile task={task} />
  </div>
)
