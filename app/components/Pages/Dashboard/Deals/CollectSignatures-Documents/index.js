import React from 'react'
import { Grid, Container, Row, Col, Tabs, Tab, Button } from 'react-bootstrap'
import { Link } from 'react-router'
import S from 'shorti'
import _ from 'underscore'
import AppStore from '../../../../../stores/AppStore'
import AppDispatcher from '../../../../../dispatcher/AppDispatcher'

export default class CollectSignatures extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      submissions: null,
      selectedDocuments: {}
    }
  }

  componentDidMount() {
    const deals = this.props.deals
    const deal_id = this.props.params.id
    const deal = _.find(deals, d => d.id === deal_id)

    if (!deal.submissions) {
      return this.getSubmissions()
    }

    this.setState({
      submissions: deal.submissions
    })
  }

  componentWillReceiveProps(nextProps) {
    const { submissions } = this.state
    const { deals } = nextProps
    const deal_id = this.props.params.id
    const deal = _.find(deals, d => d.id === deal_id)

    if (!submissions && deals.submissions)
      this.setState({ submissions: deal.submissions })
  }

  getSubmissions() {
    AppDispatcher.dispatch({
      action: 'get-submissions',
      user: this.props.user,
      id: this.props.params.id
    })
  }

  onDocumentChange(submission, e) {
    const { selectedDocuments } = this.state
    selectedDocuments[submission.id] = e.target.checked

    const docs = []
    _.each(selectedDocuments, (checked, id) => {
      if (!checked) return
      docs.push(id)
    })

    this.setState({
      selectedDocuments: docs
    })

  }

  onSubmit() {
    const { selectedDocuments } = this.state
    AppStore.data.deals_signatures = {
      documents: selectedDocuments
    }

    AppStore.emitChange()
  }

  render() {

    const { submissions } = this.state

    return (
      <div className="collect-signatures documents">

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
            // .filter(subm => subm.state === 'Completed')
            .map(subm => {
              return (
                <div
                  key={`submission${subm.id}`}
                  className="doc-detail"
                >
                  <div className="control">
                    <input
                      type="checkbox"
                      onChange={this.onDocumentChange.bind(this, subm)}
                    />
                    <img src="/static/images/deals/file.png" />
                  </div>

                  <div className="title">{ subm.title }</div>
                  <div className="status">{ subm.state }</div>
                </div>
              )
            })
            .value()
          }
        </div>

        <div className="right">
          <Button
            bsStyle="primary"
            onClick={ this.onSubmit.bind(this) }
          >
            Next
          </Button>
        </div>
      </div>
    )
  }
}
