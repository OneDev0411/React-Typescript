// Dashboard/Transactions/New/Steps/AddFinancials.js
import React, { Component } from 'react'
import { Col } from 'react-bootstrap'
import S from 'shorti'

export default class AddFinancials extends Component {

  render() {
    // Data
    // const data = this.props.data
    return (
      <div>
        <div style={ S('mb-40') }>
          <h1>Financials</h1>
        </div>
        <div>
          <Col sm={3}>
            Listing price<br/>
            $2,200,000
          </Col>
          <Col sm={3}>
            Contract price<br/>
            $2,640,000
          </Col>
          <Col sm={3}>
            Agent Commission<br/>
            3%
          </Col>
          <Col sm={3}>
            Co-Agent Commission<br/>
            1%
          </Col>
          <div className="clearfix"></div>
          <Col sm={6} />
          <Col sm={3}>
            est. payout<br/>
            $79,200
          </Col>
          <Col sm={3}>
            est. payout<br/>
            $7,920
          </Col>
        </div>
      </div>
    )
  }
}

// PropTypes
AddFinancials.proptypes = {
  data: React.PropTypes.object
}