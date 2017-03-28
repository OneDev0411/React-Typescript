import React from 'react'
import { Row, Col, ProgressBar, Button } from 'react-bootstrap'
import S from 'shorti'
import _ from 'underscore'
import Dropzone from 'react-dropzone'
import Avatar from 'react-avatar'
import PdfViewer from '../../../../Partials/Pdf/Viewer'
import AppDispatcher from '../../../../../dispatcher/AppDispatcher'
import { getTimeAgo } from '../../../../../utils/helpers'

export default class DealForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      file: null,
      preview: null,
      uploading: false
    }
  }

  componentWillReceiveProps(nextProps) {

    const { uploading } = nextProps.deal

    if (typeof uploading === 'undefined' || uploading === this.state.uploading)
      return

    this.setState({ uploading })
  }

  shouldComponentUpdate(nextProps, nextState) {

    if (nextProps.activeTab !== 'uploads')
      return false

    return true
  }

  onDrop(acceptedFiles, rejectedFiles){

    if (!acceptedFiles || acceptedFiles.length < 1)
      return false

    this.setState({
      uploading: true,
      file: null
    })

    AppDispatcher.dispatch({
      action: 'upload-file',
      user: this.props.user,
      id: this.props.deal_id,
      file: acceptedFiles[0]
    })

    const reader = new FileReader()
    reader.readAsDataURL(acceptedFiles[0])

    reader.onload = e => {
      this.setState({ preview: e.target.result })
    }
  }

  display(file) {

    const extname = file.url.split('.').pop().toLowerCase()

    if (extname === 'pdf')
      window.open(file.url, 'pdf', 'toolbar=0,status=0,width=700,height=600')

    this.setState({
      preview: null,
      uploading: false,
      file
    })
  }

  getPreviewHandler(preview) {
    const format = preview.split(';')[0]

    if (format.includes('image/'))
      return <img src={ preview } />

    if (format.includes('pdf'))
      return <PdfViewer uri={ preview } />
  }

  getDisplayHandler(url) {
    const extname = url.split('.').pop().toLowerCase()

    if (['jpg', 'jpeg', 'png', 'gif'].indexOf(extname) > -1)
      return <img src={ url } />
  }

  render() {
    const { files } = this.props
    const { file, uploading, preview } = this.state

    return (
      <div>
        <Row>
          <Col xs={6} className="list">

            <div className="dropzone">
              <Dropzone
                onDrop={this.onDrop.bind(this)}
                multiple={false}
                accept="application/pdf,image/*"
                style={{ border: 'none' }}
              >
                <img src="/static/images/deals/upload.svg" />
                <div className="title">DRAG & DROP</div>
                <div>your files to upload, or <span>Browse</span></div>
              </Dropzone>
            </div>

            <div className="files">
              {
                files &&
                _.chain(files)
                .sortBy(file => file.created_at * -1)
                .map(file => {
                  return (
                    <div
                      className="item"
                      key={`file_${file.id}`}
                      onClick={ this.display.bind(this, file) }
                    >
                      <Row>
                        <Col xs={2}>
                          <Avatar
                            round={true}
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
                  )
                })
                .value()
              }
            </div>
          </Col>

          <Col xs={6}>

            <div className="uploading">
              {
                uploading &&
                <ProgressBar active now={100} bsStyle="success" />
              }

              {
                preview &&
                <div className="preview">
                  { this.getPreviewHandler(preview) }
                </div>
              }
            </div>

            {
              file &&
              <div className="display">
                { this.getDisplayHandler(file.url) }
              </div>
            }
          </Col>
        </Row>
      </div>
    )
  }
}
