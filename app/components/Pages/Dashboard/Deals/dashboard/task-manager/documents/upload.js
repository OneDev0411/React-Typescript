import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, ProgressBar } from 'react-bootstrap'
import Dropzone from 'react-dropzone'
import moment from 'moment'
import _ from 'underscore'
import ChatModel from '../../../../../../../models/Chatroom'
import ChatMessage from '../../../../Chatroom/Util/message'
import { addAttachment } from '../../../../../../../store_actions/deals'

class UploadDocument extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dropzoneActive: false,
      uploading: false
    }
  }

  async onDrop(files) {
    const { task, addAttachment } = this.props

    if (files.length === 0) {
      return false
    }

    this.setState({ uploading: true })

    // upload file
    const file = await this.uploadFile(task.room.id, files[0])

    this.setState({ uploading: false })

    // post message to room
    if (file) {
      addAttachment(task.deal, task.checklist, task.id, file)
      this.postMessage(task.room.id, file.id)
    }
  }

  /**
   * upload a file to room
   */
  async uploadFile(roomId, file) {
    try {
      const response = await ChatModel.uploadAttachment(roomId, file)
      return response.body.data
    } catch(e) {
      return null
    }
  }

  /**
   * send message to chatroom
   */
  postMessage(roomId, fileId) {
    const { user } = this.props

    const message = {
      attachments: [fileId],
      author: user.id,
      room: roomId
    }

    ChatMessage.postMessage(roomId, message)
  }

  render() {
    const { uploading } = this.state

    return (
      <Dropzone
        ref={(node) => { this.dropzone = node }}
        onDrop={files => this.onDrop(files)}
        onDragEnter={() => this.setState({ dropzoneActive: true })}
        onDragLeave={() => this.setState({ dropzoneActive: false })}
        multiple={false}
        accept="application/pdf,image/*"
        disableClick={false}
        style={{ width: '100%' }}
      >
        <Row className="file">
          <Col sm={1} xs={12} className="image vcenter">
            <img src="/static/images/deals/upload.jpg" />
          </Col>
          <Col sm={11} xs={12} className="name vcenter">
            <div>Drag and Drop</div>
            <div>your files to upload or <span className="link">browse</span></div>
          </Col>
        </Row>
        {
          uploading &&
          <ProgressBar active now={60} />
        }
      </Dropzone>
    )
  }
}

export default connect(({ data }) => ({
  user: data.user
}), { addAttachment })(UploadDocument)
