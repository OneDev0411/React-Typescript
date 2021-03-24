import React from 'react'
import Dropzone from 'react-dropzone-rechat'
import { connect } from 'react-redux'
import { addNotification as notify } from 'components/notification'
import { mdiProgressUpload, mdiPlus } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import Message from '../Util/message'
import Model from '../../../../../models/Chatroom'

const acceptableFileTypes = 'application/pdf,image/*'

class Upload extends React.Component {
  constructor(props) {
    super(props)
    this.pasteHandler = null
    this.state = {
      dropzoneActive: false
    }
  }

  async componentDidMount() {
    const { inputHandler } = this.props
    const Rx = await import('rxjs/Rx' /* webpackChunkName: "rx" */)
    const { Observable } = Rx

    if (!inputHandler) {
      return false
    }

    // subscribe to paste
    this.pasteHandler = Observable.fromEvent(
      document.getElementById(inputHandler),
      'paste'
    ).subscribe(e => this.onPasteFile(e))
  }

  componentWillUnmount() {
    if (this.pasteHandler) {
      this.pasteHandler.unsubscribe()
    }
  }

  /**
   * handle paste file from clipboard
   */
  onPasteFile(event) {
    const { files } = event.clipboardData || event.originalEvent.clipboardData

    const fileList = Array.slice(files)

    fileList.forEach(file => {
      try {
        file.preview = window.URL.createObjectURL(file)
      } catch (err) {
        console.error('Failed to generate preview for file', file, err)
      }
    })

    this.onDrop(fileList)
  }

  /**
   * on drop/upload files into area
   */
  async onDrop(files) {
    const { roomId } = this.props

    this.setState({
      dropzoneActive: false
    })

    if (files.length === 0) {
      return false
    }

    // list of ids of attachments
    const attachments = []

    // create temporary message
    let { qid, message } = this.createTemporaryMessage(roomId, files)

    await Promise.all(
      files.map(async (file, index) => {
        // update message
        message = this.updateMessage(roomId, message, {
          index,
          current: file
        })

        // upload file
        const fileId = await this.uploadFile(roomId, file)

        if (fileId) {
          attachments.push(fileId)
        }
      })
    )

    // update message
    this.updateMessage(roomId, message, {
      index: ~~message.index + 1,
      current: null
    })

    // post message to server
    this.postMessage(roomId, attachments, qid)
  }

  /**
   * upload a file to room
   */
  async uploadFile(roomId, file) {
    try {
      const response = await Model.uploadAttachment(roomId, file)

      return response.body.data.id
    } catch (e) {
      return null
    }
  }

  /**
   * update message data
   */
  updateMessage(roomId, message, attributes) {
    // update message
    message = {
      ...message,
      ...attributes
    }

    // updaye message
    Message.update(roomId, message)

    return message
  }

  /**
   * create uploading message
   */
  createTemporaryMessage(roomId, files) {
    const { author } = this.props

    const message = {
      comment: '',
      uploading: true,
      index: 0,
      count: files.length,
      current: files[0]
    }

    const { qid, tempMessage } = Message.createTemporaryMessage(
      roomId,
      message,
      author
    )

    // store message into messages list
    Message.create(roomId, tempMessage)

    return { qid, message: tempMessage }
  }

  /**
   * save message on server
   */
  postMessage(roomId, attachments, qid) {
    const { author } = this.props

    const message = {
      attachments,
      author: author.id,
      room: roomId
    }

    Message.postMessage(roomId, message, qid)
  }

  render() {
    const { children, disableClick, disabled } = this.props
    const { dropzoneActive } = this.state

    if (disabled === true) {
      return children
    }

    return (
      <div className="upload">
        <Dropzone
          ref={node => {
            this.dropzone = node
          }}
          onDrop={files => this.onDrop(files)}
          onDropRejected={() => {
            this.props.notify({
              title: 'File Type Error',
              message: 'This type of file not allowed',
              status: 'error'
            })
          }}
          onDragEnter={() => this.setState({ dropzoneActive: true })}
          onDragLeave={() => this.setState({ dropzoneActive: false })}
          multiple
          accept={acceptableFileTypes}
          disableClick={disableClick || false}
          style={this.props.dropZoneStyle}
        >
          {dropzoneActive && (
            <div className="upload-guide">
              <div className="upload-area">
                <SvgIcon path={mdiProgressUpload} size="70px" />
                <p>Upload Here</p>
              </div>
            </div>
          )}

          {children || <SvgIcon path={mdiPlus} />}
        </Dropzone>
      </div>
    )
  }
}

export default connect(null, {
  notify
})(Upload)
