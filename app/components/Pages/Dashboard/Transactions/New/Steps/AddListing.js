// Dashboard/Transactions/New/Steps/AddListing.js
import React, { Component } from 'react'
import { Button, Input } from 'react-bootstrap'
import S from 'shorti'

export default class AddListing extends Component {

  render() {
    // Data
    // const data = this.props.data
    return (
      <div>
        <img style={ S('h-121') } src="/images/dashboard/transactions/house.png" />
        <div style={ S('mb-40') }>
          <h1>We’re almost done! Do you have a property listing in mind?</h1>
        </div>
        <div>
          <div style={ S('maxw-820') }>
            <Input className="pull-left" style={ S('w-640') } type="text" placeholder="Enter any name, email or phone number"/>
            <Button className="pull-left" style={ S('w-160 ml-10') } bsStyle="primary" type="button">Add New Property</Button>
          </div>
          <div className="clearfix"></div>
        </div>
      </div>
    )
  }
}

// PropTypes
AddListing.proptypes = {
  data: React.PropTypes.object
}