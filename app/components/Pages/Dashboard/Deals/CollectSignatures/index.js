import React from 'react'
import { Grid, Container, Row, Col, Tabs, Tab, Button } from 'react-bootstrap'
import { Link } from 'react-router'
import S from 'shorti'
import _ from 'underscore'
import AppDispatcher from '../../../../../dispatcher/AppDispatcher'

export default class CollectSignatures extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      submissions: null
    }
  }

  componentDidMount() {
    const deals = this.props.deals
    const deal_id = this.props.params.id
    const deal = _.find(deals, d => d.id === deal_id)

    if (!deal.submissions) {
      return this.getSubmissions()
    }

    console.log(deal.submissions)
    this.setState({
      submissions: deal.submissions
    })
  }

  getSubmissions() {
    AppDispatcher.dispatch({
      action: 'get-submissions',
      user: this.props.user,
      id: this.props.params.id
    })
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
                    <input type="checkbox" />
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
      </div>
    )
  }
}
