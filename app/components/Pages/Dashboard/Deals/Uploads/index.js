import React from 'react'
import { Grid, Container, Row, Col, Tabs, Tab, Button } from 'react-bootstrap'
import S from 'shorti'
import _ from 'underscore'
import Dropzone from 'react-dropzone'
import Avatar from 'react-avatar'
import AppDispatcher from '../../../../../dispatcher/AppDispatcher'
import { getTimeAgo } from '../../../../../utils/helpers'

export default class DealForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      file: null
    }
  }

  componentDidMount() {

  }

  onDrop(acceptedFiles, rejectedFiles){

    if (!acceptedFiles || acceptedFiles.length < 1)
      return false

    console.log('>1')
    AppDispatcher.dispatch({
      action: 'upload-file',
      user: this.props.user,
      id: this.props.deal_id,
      file: acceptedFiles[0]
    })
    console.log('>2')
  }

  display(file) {
    this.setState({
      file
    })
  }

  render() {
    const { files } = this.props
    const { file } = this.state

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
          </Col>

          <Col xs={6}>
            {
              file &&
              <div className="display">
                <code>I have problem with setting Amazon AWS cookies for private file, so Emil should look and fix that</code>
                <img src={file.url} />
              </div>
            }
          </Col>
        </Row>
      </div>
    )
  }
}
