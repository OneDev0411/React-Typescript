import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, ProgressBar } from 'react-bootstrap'
import { batchActions } from 'redux-batched-actions'
import Dropzone from 'react-dropzone'
import moment from 'moment'
import _ from 'underscore'
import cn from 'classnames'
import ChatModel from '../../../../../../models/Chatroom'
import ChatMessage from '../../../Chatroom/Util/message'
import { addAttachment, setUploadFiles } from '../../../../../../store_actions/deals'

class UploadDocument extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dropzoneActive: false
    }
  }

  async onDrop(files) {
    const { deal, task, onDrop, onDropHandler } = this.props
    const { dropzoneActive } = this.state

    this.setState({
      dropzoneActive: false
    })

    if (onDrop) {
      return onDrop(files)
    }

    this.props.setUploadFiles(files, deal, task)
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

  /**
   * open file dialog
   */
  openDialog() {
    this.dropzone.open()
  }

  render() {
    const { dropzoneActive } = this.state
    const { children, task, hasAttachments } = this.props
    const { uploading } = (task || {})

    return (
      <Dropzone
        disableClick
        ref={(node) => this.dropzone = node}
        onDrop={(files) => this.onDrop(files)}
        onDragEnter={() => this.setState({ dropzoneActive: true })}
        onDragLeave={() => this.setState({ dropzoneActive: false })}
        multiple
        accept="application/pdf,image/*"
        style={{ width: '100%' }}
      >
        {
          dropzoneActive &&
          <div
            className="upload-placeholder"
          >
            <div className="upload-area">
              <img src="/static/images/deals/dnd.png" />
              <h1 className="title">Drop to upload to this task</h1>
              <span className="desc">
                You can drag and drop any files to the upload section of the task you are in.
              </span>
            </div>
          </div>
        }

        {
          children ||
          <div className={cn('file-upload', { 'has-attachments': hasAttachments })}>

            <div className="item">

              <div className="image">
                <img src="/static/images/deals/upload-file.svg" />
              </div>
              <div className="name">
                <div>
                  Drag and Drop your files to upload or&nbsp;
                  <span className="link" onClick={() => this.openDialog()}>browse</span>
                </div>
              </div>
              <div className="actions" />
            </div>

            {
              uploading &&
              <ProgressBar active now={70} />
            }
          </div>
        }
      </Dropzone>
    )
  }
}

export default connect(({ user }) => ({
  user
}), { addAttachment, setUploadFiles })(UploadDocument)
