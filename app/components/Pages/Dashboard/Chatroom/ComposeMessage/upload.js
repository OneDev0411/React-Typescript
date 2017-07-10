import React from 'react'
import Dropzone from 'react-dropzone'
import Message from '../Util/message'
import Model from '../../../../../models/Chatroom'

export default class Upload extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      dropzoneActive: false
    }
  }

  componentDidMount() {

  }

  async onDrop(files) {
    const { roomId } = this.props

    this.setState({
      dropzoneActive: false
    })

    // list of ids of attachments
    const attachments = []

    // create temporary message
    let { qid, message } = this.createTemporaryMessage(files)

    for (let index in files) {
      const file = files[index]

      // update message
      message = this.updateMessage(message, {
        index,
        current: file
      })

      // upload file
      const fileId = await this.uploadFile(file)
      if (fileId) {
        attachments.push(fileId)
      }
    }

    // update message
    this.updateMessage(message, {
      index: ~~message.index + 1,
      current: null
    })

    this.postMessage(attachments, qid)
  }

  async uploadFile(file) {
    const { roomId } = this.props

    try {
      const response = await Model.uploadAttachment(roomId, file)
      return response.body.data.id
    } catch(e) {
      return null
    }
  }

  updateMessage(message, attributes) {
    const { roomId } = this.props

    // update message
    message = {
      ...message,
      ...attributes
    }

    // updaye message
    Message.update(roomId, message)

    return message
  }

  createTemporaryMessage(files) {
    const { roomId, author } = this.props

    const message = {
      comment: '',
      uploading: true,
      index: 0,
      count: files.length,
      current: files[0]
    }

    const { qid, tempMessage } = Message.createTemporaryMessage(roomId, message, author)

    // store message into messages list
    Message.create(roomId, tempMessage)

    return { qid, message: tempMessage }
  }

  postMessage(attachments, qid) {
    const { roomId, author } = this.props

    const message = {
      attachments,
      author: author.id,
      room: roomId
    }

    Message.postMessage(roomId, message, qid)
  }

  render() {
    const { children, disableClick } = this.props
    const { dropzoneActive } = this.state

    return (
      <div className="upload">
        <Dropzone
          ref={(node) => { this.dropzone = node }}
          onDrop={files => this.onDrop(files)}
          onDragEnter={() => this.setState({ dropzoneActive: true })}
          onDragLeave={() => this.setState({ dropzoneActive: false })}
          multiple={true}
          accept="application/pdf,image/*"
          disableClick={disableClick || false}
          style={this.props.dropZoneStyle}
        >
          {
            dropzoneActive &&
            <div
              className="upload-guide"
            >
              <div className="upload-area">
                <i className="fa fa-long-arrow-down fa-3x" />
                <p>Upload Here</p>
              </div>
            </div>
          }

          {
            children ? children : <i className="fa fa-plus" aria-hidden="true" />
          }
        </Dropzone>
      </div>
    )
  }
}
