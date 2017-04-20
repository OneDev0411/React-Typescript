import React from 'react'
import { Row, Col, Modal, ProgressBar, Button } from 'react-bootstrap'
import S from 'shorti'
import _ from 'underscore'
import Dropzone from 'react-dropzone'
import Avatar from 'react-avatar'
import Lightbox from 'react-images'
import PdfViewer from '../../../../Partials/Pdf/Viewer'
import DealDispatcher from '../../../../../dispatcher/DealDispatcher'
import { getTimeAgo } from '../../../../../utils/helpers'

export default class DealForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      file: null,
      preview: null,
      uploading: false,
      showBox: false,
      dropzoneActive: false
    }
  }

  componentDidMount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.activeTab !== 'uploads')
      return false

    return true
  }

  async onDrop(acceptedFiles, rejectedFiles) {
    if (!acceptedFiles || acceptedFiles.length < 1)
      return false

    this.setState({
      uploading: true,
      dropzoneActive: false,
      file: null
    })

    const reader = new FileReader()
    reader.readAsDataURL(acceptedFiles[0])

    reader.onload = (e) => {
      this.setState({ preview: e.target.result })
    }


    await DealDispatcher.dispatchSync({
      action: 'upload-file',
      user: this.props.user,
      id: this.props.deal_id,
      file: acceptedFiles[0]
    })

    this.setState({
      uploading: false,
      file: this.props.files[this.props.files.length - 1]
    })
  }

  getPreviewHandler(preview) {
    const type = this.getFileType(preview.split(';')[0])

    const file = {
      url: preview
    }

    return this.getDisplayComponent(file, type)
  }

  display(file) {
    this.setState({ file })
  }

  getDisplayComponent(file, type = null) {

    if (!type)
      type = this.getFileType(file.mime)

    if (type === 'image')
      return this.renderImage(file)

    if (type === 'pdf')
      return this.renderPdf(file)

  }

  renderImage(file) {
    return (
      <div className="image">
        <img
          onClick={() => this.setState({ showBox: true})}
          src={file.url}
        />
        { file.name}
      </div>
    )
  }

  renderPdf(file) {
    return (
      <div>
        <div style={{textAlign: 'right'}}>
          <a
            href={file.url}
            target="_blank"
            className="btn btn-primary"
          >
            Open in new tab
          </a>
        </div>

        <PdfViewer
          uri={file.url}
          scale={0.9}
        />
      </div>
    )
  }

  getFileType(mime) {
    if (mime.includes('image/'))
      return 'image'

    if (mime.includes('pdf'))
      return 'pdf'
  }

  render() {
    const { files } = this.props
    const { file, uploading, preview, dropzoneActive } = this.state
    return (
      <div>
        <Dropzone
          onDrop={this.onDrop.bind(this)}
          onDragEnter={() => this.setState({ dropzoneActive: true })}
          onDragLeave={() => this.setState({ dropzoneActive: false })}
          multiple={false}
          accept="application/pdf,image/*"
          style={{ border: 'none' }}
        >
          {
            dropzoneActive &&
            <div
              className="upload-intro"
            >
              <div className="upload-area">
                <img src="/static/images/deals/dnd.png" />
                <h1>Drop to upload to this deal</h1>
                <span>You can drag and drop any files to the upload section of the deal you are in.</span>
              </div>
            </div>
          }

          <Row className="dropzone" style={{ margin: 0 }}>
            <Col xs={5} sm={4} className="list">
              {
                uploading &&
                <div>
                  <ProgressBar active now={100} bsStyle="success" />
                </div>
              }

              <div className="dropbox">
                <img src="/static/images/deals/upload.svg" />
                <div className="title">DRAG & DROP</div>
                <div>your files to upload, or <span>Browse</span></div>
              </div>

              <div className="files">
                {
                  files &&
                  _.chain(files)
                  .sortBy(file => file.created_at * -1)
                  .map(file => (
                    <div
                      className="item"
                      key={`file_${file.id}`}
                      onClick={this.display.bind(this, file)}
                    >
                      <Row>
                        <Col xs={2}>
                          <Avatar
                            round
                            src={file.preview_url}
                            size={40}
                          />
                        </Col>

                        <Col xs={10}>
                          <div><b>{ file.name }</b></div>
                          <div>Uploaded { getTimeAgo(file.created_at) } ago</div>
                        </Col>
                      </Row>
                    </div>
                    ))
                  .value()
                }

                {
                  !files &&
                  <div className="empty">
                    You haven’t uploaded anything yet
                  </div>
                }
              </div>
            </Col>

            <Col xs={7} sm={8}>

              <div className="uploading">
                {
                  uploading && preview &&
                  <div className="preview">
                    { this.getPreviewHandler(preview) }
                  </div>
                }
              </div>

              {
                file &&
                <div className="display">
                  { this.getDisplayComponent(file) }
                </div>
              }
            </Col>
          </Row>
        </Dropzone>

        <Lightbox
          images={file ? [{ src: file.url }] : []}
          isOpen={this.state.showBox}
          onClose={() => this.setState({ showBox: false })}
        />
      </div>
    )
  }
}
