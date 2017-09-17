import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Lightbox from 'react-images'
import moment from 'moment'
import _ from 'underscore'
import UploadFile from './upload'
import FileModal from '../../../../../Partials/Pdf/Modal'

export default ({
  task
}) => {

  if (!task) {
    return null
  }

  const attachments = task.room.attachments || []

  return (
    <div className="file">
      <div className="title">Uploads</div>
      {
        attachments.length > 0 &&
        <div className="file-group">
          <FileAttachments attachments={attachments} />
        </div>
      }

      <UploadFile task={task} />
    </div>
  )
}

/**
 * render pdf attachments
 */
class FileAttachments extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedFile: {},
      showViewer: false
    }
  }

  isPdf(file) {
    return file.mime === 'application/pdf'
  }

  isImage(file) {
    return file.mime.includes('image/')
  }

  openDoc(file) {
    this.setState({
      selectedFile: file,
      showViewer: true
    })
  }

  render() {
    const { attachments } = this.props
    const { showViewer, selectedFile } = this.state

    const files = attachments
      .filter(file => this.isPdf(file) || this.isImage(file))
      .map(file => ({
        id: file.id,
        name: file.name,
        type: this.isPdf(file) ? 'pdf' : 'image',
        preview_url: file.preview_url,
        src: file.url
      }))

    return (
      <div>
        <FileModal
          file={{
            type: selectedFile.type,
            name: selectedFile.name,
            src: selectedFile.src
          }}
          isActive={showViewer}
          onCloseHandler={() => this.setState({ showViewer: false })}
        />

        {
          files.map((file, key) =>
            <Row
              key={`PDF_FILE_${file.id}`}
              className="item"
              style={{ cursor: 'pointer' }}
              onClick={() => this.openDoc(file)}
            >
              <Col sm={1} xs={12} className="image vcenter">
                <img src={file.preview_url} />
              </Col>
              <Col sm={8} xs={12} className="name vcenter">
                { file.name }
              </Col>

              <Col sm={3} xs={12} className="actions vcenter">
                <button
                  className="btn-deal"
                  onClick={() => this.openDoc(file)}
                >
                  View
                </button>
              </Col>
            </Row>
          )
        }
      </div>
    )
  }
}

