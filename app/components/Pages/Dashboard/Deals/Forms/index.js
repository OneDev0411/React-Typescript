import React from 'react'
import { Grid, Container, Row, Col, Tabs, Tab, Button } from 'react-bootstrap'
import S from 'shorti'
import _ from 'underscore'
import 'pdfjs-dist/build/pdf.combined'
import 'pdfjs-dist/web/compatibility'
import config from '../../../../../../config/public'

export default class DealForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount() {

  }

  async loadForm(submission) {
    const { last_revision } = submission
    const { user } = this.props
    const token = user.access_token
    const url = `${config.forms.url}/submissions/${last_revision}.pdf?token=${token}&flat=1`

    try {
      const doc = await PDFJS.getDocument(url)
      console.log(doc)
    }
    catch(e) {
    }

  }

  render() {
    const { submissions } = this.props

    return (
      <div>
        <Button className="add-form-btn">
          Add Blank Form
        </Button>

        <Row style={ S('mt-30') }>
          <Col xs={7}>
            {
              submissions && submissions.map(submission => {
                return (
                  <div
                    key={`submission${submission.id}`}
                    className="doc-detail"
                    onClick={ this.loadForm.bind(this, submission) }
                  >
                    <img src="/static/images/deals/file.png" />
                    <div className="title">{ submission.title }</div>
                    <div className="status">{ submission.state }</div>
                  </div>
                )
              })
            }
          </Col>
          <Col xs={5}>---</Col>
        </Row>
      </div>
    )
  }
}
