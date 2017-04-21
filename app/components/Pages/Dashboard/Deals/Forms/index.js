import React from 'react'
import { Row, Col, Button } from 'react-bootstrap'
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
    this.mounted = true
    this.state = {
      submission: null,
      documentUrl: null,
      documentLoaded: false
    }
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillReceiveProps(nextProps) {
    const { submissions } = nextProps
    const { submission } = this.state

    if (submissions && !submission)
      this.loadForm(submissions[submissions.length - 1])
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.activeTab === 'forms'
  }

  componentWillUnmount() {
    this.mounted = false
  }

  loadForm(submission) {
    if (!submission)
      return false

    if (this.state.submission && submission.id === this.state.submission.id)
      return false

    const { file } = submission

    this.setState({
      submission,
      documentUrl: file.url,
      documentLoaded: false
    })
  }

  editForm() {
    const { submission } = this.state
    const { deal_id } = this.props
    browserHistory.push(`/dashboard/deals/${deal_id}/edit-form/${submission.form}/update`)
  }

  onAddForm(form) {
    const { deal_id } = this.props
    browserHistory.push(`/dashboard/deals/${deal_id}/edit-form/${form.id}/create`)
  }

  render() {
    const { submissions, forms, user } = this.props
    const { submission, documentUrl, showSelectForm } = this.state

    return (
      <div>
        <Row>
          <Col xs={5}>

            <FormSelect
              forms={forms}
              user={user}
              onSelect={this.onAddForm.bind(this)}
            />

            {
              submissions &&
              _.chain(submissions)
              .sortBy(subm => subm.created_at * -1)
              .map(subm => (
                <div
                  key={`submission${subm.id}`}
                  className={cn('doc-detail', { selected: submission.id === subm.id })}
                  onClick={this.loadForm.bind(this, subm)}
                >
                  <img src="/static/images/deals/file.png" />
                  <div className="title">{ subm.title }</div>
                  <div className="status">{ subm.state === 'Fair' ? 'Completed' : subm.state }</div>
                </div>
              ))
              .value()
            }

            {
              !submissions &&
              <div className="loading center">
                <i className="fa fa-spinner fa-spin fa-2x fa-fw" />
              </div>
            }

            {
              submissions && submissions.length === 0 &&
              <div className="no-form">
                You currently have no forms added
              </div>
            }
          </Col>

          <Col xs={7}>
            {
              submissions && submissions.length > 0 &&
              <div style={{ textAlign: 'right' }}>
                <a
                  target="_blank"
                  href={documentUrl}
                  className="btn btn-primary"
                >
                  View
                </a>

                <Button
                  style={{ marginLeft: '5px' }}
                  bsStyle="primary"
                  onClick={this.editForm.bind(this)}
                >
                  Edit Pdf
                </Button>
              </div>
            }

            <PdfViewer
              uri={documentUrl}
              scale={0.7}
              onLoad={() => this.setState({ documentLoaded: true }) }
            />
          </Col>
        </Row>

      </div>
    )
  }
}
