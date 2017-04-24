import React from 'react'
import { Button } from 'react-bootstrap'
import { browserHistory } from 'react-router'
import S from 'shorti'
import _ from 'underscore'
import AppStore from '../../../../../stores/AppStore'
import DealDispatcher from '../../../../../dispatcher/DealDispatcher'

export default class CollectSignatures extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      submissions: null,
      selectedDocuments: {}
    }
  }

  componentDidMount() {
    const { deals, params } = this.props
    const deal = deals.list[params.id]

    if (AppStore.data.deals.signatures && AppStore.data.deals.signatures.documents) {
      this.setState({
        selectedDocuments: AppStore.data.deals.signatures.documents || {}
      })
    }

    if (!deal.submissions)
      return this.getSubmissions()


    this.setState({
      submissions: deal.submissions
    })
  }

  componentWillReceiveProps(nextProps) {
    const { submissions } = this.state
    const { deals } = nextProps
    const deal = deals.list[this.props.params.id]

    if (!submissions && deals.submissions)
      this.setState({ submissions: deal.submissions })
  }

  getSubmissions() {
    DealDispatcher.dispatch({
      action: 'get-submissions',
      user: this.props.user,
      id: this.props.params.id
    })
  }

  onDocumentChange(submission) {
    const { selectedDocuments } = this.state

    if (!selectedDocuments[submission.id])
      selectedDocuments[submission.id] = submission
    else
      delete selectedDocuments[submission.id]

    this.setState({ selectedDocuments })
  }

  onSubmit() {
    const { selectedDocuments } = this.state
    AppStore.data.deals.signatures = {
      documents: selectedDocuments
    }

    AppStore.emitChange()

    // navigate to collect recipients page
    browserHistory.push(`/dashboard/deals/${this.props.params.id}/collect-signatures/recipients`)
  }

  close() {
    browserHistory.push(`/dashboard/deals/${this.props.params.id}`)
  }

  render() {
    const { submissions, selectedDocuments } = this.state

    return (
      <div className="collect-signatures documents">

        <div className="close" onClick={this.close.bind(this)}>
          <i className="fa fa-times fa-1x" />
          esc
        </div>

        <h2>Select documents</h2>
        <p className="title">
          <img src="/static/images/deals/pen.svg" />
          to send for e-Signatures
        </p>

        <div className="hr" />
        <div>
          {
            submissions &&
            _.chain(submissions)
            .filter(subm => subm.state === 'Fair')
            .map(subm => (
              <div
                key={`submission${subm.id}`}
                className="doc-detail"
                onClick={this.onDocumentChange.bind(this, subm)}
              >
                <div className="control">
                  <input
                    type="checkbox"
                    onChange={() => {}}
                    checked={typeof selectedDocuments[subm.id] !== 'undefined'}
                  />
                  <img src="/static/images/deals/file.png" />
                </div>

                <div className="title">{ subm.title }</div>
                <div className="status">Completed</div>
              </div>
              ))
            .value()
          }
        </div>

        <div className="right" style={{ marginTop: '10px' }}>

          {
            _.size(selectedDocuments) > 0 &&
            <span style={{ marginRight: '15px', color: 'gray' }}>
              { _.size(selectedDocuments) } documents selected
            </span>
          }

          <Button
            bsStyle="primary"
            onClick={this.onSubmit.bind(this)}
            disabled={_.size(selectedDocuments) === 0}
          >
            Next
          </Button>
        </div>
      </div>
    )
  }
}
