// Dashboard/Transactions/New/Steps/AddFinancials.js
import React, { Component } from 'react'
import { Button, Input } from 'react-bootstrap'
import S from 'shorti'

export default class AddFinancials extends Component {

  render() {
    // Data
    // const data = this.props.data
    return (
      <div>
        <h1>Add Financials</h1>
        <div>
          <form style={ S('maxw-820') }>
            <Input className="pull-left" style={ S('w-640') } type="text" placeholder="Enter any name, email or phone number"/>
            <Button className="pull-left" style={ S('w-160 ml-10') } bsStyle="primary" type="button">Add New Contact</Button>
          </form>
          <div className="clearfix"></div>
        </div>
      </div>
    )
  }
}

// PropTypes
AddFinancials.proptypes = {
  data: React.PropTypes.object.isRequired
}