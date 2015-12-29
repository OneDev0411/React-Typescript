// Dashboard/Transactions/New/Steps/AddDates.js
import React, { Component } from 'react'
import { Col } from 'react-bootstrap'
import S from 'shorti'

export default class AddDates extends Component {

  render() {
    // Data
    // const data = this.props.data
    return (
      <div>
        <div style={ S('mb-40') }>
          <h1>Important Dates</h1>
        </div>
        <div>
          <Col sm={4}>
            Contract<br/>
            FRIDAY<br/>
            DECEMBER 18th
          </Col>
          <Col sm={4}>
            Due Diligence<br/>
            WEDNESDAY<br/>
            DECEMBER 20th
          </Col>
          <Col sm={4}>
            Closing<br/>
            MONDAY<br/>
            DECEMBER 21st
          </Col>
        </div>
      </div>
    )
  }
}

// PropTypes
AddDates.proptypes = {
  data: React.PropTypes.object
}