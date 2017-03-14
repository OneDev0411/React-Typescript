import React from 'react'
import { Grid, Container, Row, Col, Tabs, Tab, Button } from 'react-bootstrap'
import S from 'shorti'
import _ from 'underscore'
import PdfViewer from '../../../../Partials/Pdf/Viewer'
import config from '../../../../../../config/public'

export default class DealForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      submission: null,
      documentUrl: null
    }
  }

  componentDidMount() {

  }

  loadForm(submission) {
    const { last_revision } = submission
    const { user } = this.props
    const token = user.access_token
    const documentUrl = `${config.forms.url}/submissions/${last_revision}.pdf?token=${token}&flat=1`

    this.setState({
      submission,
      documentUrl
    })
  }

  render() {
    const { submissions } = this.props
    const { submission, documentUrl } = this.state

    return (
      <div>
        <Row>
          <Col xs={5}>

            <Button className="add-form-btn">
              Add Blank Form
            </Button>

            {
              submissions && submissions.map(subm => {
                return (
                  <div
                    key={`submission${subm.id}`}
                    className="doc-detail"
                    onClick={ this.loadForm.bind(this, subm) }
                  >
                    <img src="/static/images/deals/file.png" />
                    <div className="title">{ subm.title }</div>
                    <div className="status">{ subm.state }</div>
                  </div>
                )
              })
            }

            {
              !submissions &&
              <div className="loading center">
                <i className="fa fa-spinner fa-spin fa-2x fa-fw"></i>
              </div>
            }

            {
              submissions && submissions.length === 0 &&
              <div className="no-form">
                There is no form
              </div>
            }
          </Col>

          <Col xs={7}>
            <PdfViewer uri={documentUrl} scale={0.7} />
          </Col>
        </Row>
      </div>
    )
  }
}
