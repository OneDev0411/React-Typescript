import React from 'react'
import { Row, Col, Button} from 'react-bootstrap'
import { browserHistory } from 'react-router'
import S from 'shorti'
import _ from 'underscore'
import cn from 'classnames'
import AppDispatcher from '../../../../../dispatcher/AppDispatcher'
import PdfViewer from '../../../../Partials/Pdf/Viewer'
import FormSelect from '../Form-Select'
import config from '../../../../../../config/public'

export default class DealForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      submission: null,
      documentUrl: null,
      documentLoaded: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const { submissions } = nextProps
    const { submission } = this.state

    if (submissions && !submission) {
      this.loadForm(submissions[0])
    }
  }

  loadForm(submission) {

    if (!submission)
      return false

    const { last_revision } = submission
    const { user } = this.props
    const token = user.access_token
    const documentUrl = `${config.forms.url}/submissions/${last_revision}.pdf?token=${token}&flat=1`

    this.setState({
      submission,
      documentUrl,
      documentLoaded: false,
    })
  }

  editForm() {
    const { submission } = this.state
    const { deal_id } = this.props
    browserHistory.push(`/dashboard/deals/${deal_id}/edit-form/${submission.form}`)
  }

  onAddForm(form) {
    AppDispatcher.dispatch({
      action: 'add-submission',
      id: this.props.deal_id,
      form
    })
  }

  render() {
    const { submissions, forms, user } = this.props
    const { submission, documentUrl, showSelectForm } = this.state

    return (
      <div>
        <Row>
          <Col xs={5}>

            <FormSelect
              forms={ forms }
              user={user}
              onSelect={this.onAddForm.bind(this)}
            />

            {
              submissions && submissions.map(subm => {
                return (
                  <div
                    key={`submission${subm.id}`}
                    className={ cn('doc-detail', { selected: submission.id === subm.id } )}
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

            {
              this.state.documentLoaded &&
              <div style={{ textAlign: 'right' }}>
                <Button
                  bsStyle="primary"
                  onClick={ this.editForm.bind(this) }
                >
                  Edit Pdf
                </Button>
              </div>
            }

            <PdfViewer
              uri={documentUrl}
              scale={0.7}
              onLoaded={ () => this.setState({ documentLoaded: true}) }
            />
          </Col>
        </Row>

      </div>
    )
  }
}
