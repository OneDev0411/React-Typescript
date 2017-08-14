import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Lightbox from 'react-images'
import moment from 'moment'
import _ from 'underscore'
import FileModal from '../../../../../../Partials/Pdf/Modal'

export default ({
  task
}) => {

  if (!task) {
    return null
  }

  const attachments = task.room.attachments || []

  return (
    <div>
      <FileAttachments attachments={attachments} />
      <UnknownAttachments attachments={attachments} />
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

        <div className="file">
          <div className="title">Uploads</div>
          {
            files.map((file, key) =>
              <Row
                key={`PDF_FILE_${file.id}`}
                className="item"
              >
                <Col sm={1} xs={12} className="image vcenter">
                  <img src={file.preview_url} />
                </Col>
                <Col sm={8} xs={12} className="name vcenter">
                  <div>{ file.name }</div>
                  <div>{ moment(file.created_at).format('Y/M/D') }</div>
                </Col>

                <Col sm={3} xs={12} className="actions vcenter">
                  <button
                    onClick={() => {
                      this.setState({
                        selectedFile: file,
                        showViewer: true
                      })
                    }}
                  >
                    View
                  </button>
                </Col>
              </Row>
            )
          }
        </div>
      </div>
    )
  }
}

/**
 * render unknown attachments
 */
const UnknownAttachments = ({
  attachments
}) => {
  const files = attachments
    .filter(file => file.mime !== 'application/pdf' && !file.mime.includes('image/'))
    .map(file => ({
      id: file.id,
      preview_url: file.preview_url,
      url: file.url
    }))

  return (
    <div className="inline">
      {
        files.map((file, key) =>
          <Row
            key={`UNKNOWN_FILE_${file.id}`}
            className="file"
          >
            <Col sm={1} xs={12} className="image vcenter">
              <img src={file.preview_url} />
            </Col>
            <Col sm={8} xs={12} className="name vcenter">
              <div>{ file.name }</div>
              <div>{ moment(file.created_at).format('Y/M/D') }</div>
            </Col>

            <Col sm={3} xs={12} className="actions vcenter">
              <a
                href={file.url}
                target="_blank"
                className="btn-view"
              >
                View
              </a>
            </Col>
          </Row>
        )
      }
    </div>
  )
}

