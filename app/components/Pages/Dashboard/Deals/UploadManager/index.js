import React from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import cn from 'classnames'

import Deal from 'models/Deal'

import { setUploadFiles } from 'actions/deals'
import { confirmation } from 'actions/confirmation'

import ChatMessage from '../../Chatroom/Util/message'

class UploadDocument extends React.Component {
  state = {
    dropzoneActive: false
  }

  async onDrop(files, rejectedFiles) {
    const { onDrop, setUploadFiles, activeChecklist, confirmation } = this.props

    this.setState({
      dropzoneActive: false
    })

    if (activeChecklist && activeChecklist.is_terminated) {
      return confirmation({
        message: 'Folder Is Terminated',
        description: 'You cannot upload file in terminated folders',
        onConfirm: () => null,
        hideCancelButton: true,
        confirmLabel: 'Okay'
      })
    }

    if (rejectedFiles && rejectedFiles.length > 0) {
      const acceptedFiles = Deal.upload
        .getAcceptedDocuments()
        .replace(/,/gi, ', ')

      return confirmation({
        message: 'Cannot Upload this File',
        description: `Some file formats are not supported. You can upload: ${acceptedFiles}`,
        onConfirm: () => null,
        hideCancelButton: true,
        confirmLabel: 'Okay'
      })
    }

    if (onDrop) {
      return onDrop(files)
    }

    setUploadFiles(files)
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

  handleRef = ref => {
    this.dropzone = ref

    if (this.props.onRef) {
      this.props.onRef(ref)
    }
  }

  render() {
    const { dropzoneActive } = this.state
    const { children, hasAttachments } = this.props

    return (
      <Dropzone
        disableClick={this.props.disableClick}
        ref={this.handleRef}
        onDrop={(files, rejectedFiles) => this.onDrop(files, rejectedFiles)}
        onDragEnter={() => this.setState({ dropzoneActive: true })}
        onDragLeave={() => this.setState({ dropzoneActive: false })}
        multiple
        accept={Deal.upload.getAcceptedDocuments()}
        style={{ width: '100%' }}
      >
        {dropzoneActive && (
          <div className="upload-placeholder">
            <div className="upload-area">
              <img src="/static/images/deals/dnd.png" alt="" />
              <h1 className="title">Drop to upload to this task</h1>
              <span className="desc">
                You can drag and drop any files to the upload section of the
                task you are in.
              </span>
            </div>
          </div>
        )}

        {children || (
          <div
            className={cn('file-upload', { 'has-attachments': hasAttachments })}
          >
            <div className="item">
              <div className="image">
                <img src="/static/images/deals/upload-file.svg" alt="" />
              </div>
              <div className="name">
                <div>
                  Drag and Drop your files to upload or&nbsp;
                  <span className="link" onClick={() => this.openDialog()}>
                    browse
                  </span>
                </div>
              </div>
              <div className="actions" />
            </div>
          </div>
        )}
      </Dropzone>
    )
  }
}

function mapStateToProps({ user, deals }) {
  const { checklists, selectedTask } = deals

  return {
    user,
    activeChecklist:
      selectedTask && checklists ? checklists[selectedTask.checklist] : null
  }
}

export default connect(
  mapStateToProps,
  { setUploadFiles, confirmation }
)(UploadDocument)
