// Dashboard/Transactions/New/Steps/AddFinancials.js
import React, { Component } from 'react'
import { Col, Input } from 'react-bootstrap'
import S from 'shorti'
import helpers from '../../../../../../utils/helpers'

export default class AddFinancials extends Component {

  calculateFinancials() {
    const price = this.refs.price.refs.input.value
    const contract_price = this.refs.contract_price.refs.input.value
    const agent_commission = this.refs.agent_commission.refs.input.value
    const co_agent_commission = this.refs.co_agent_commission.refs.input.value
    this.props.calculateFinancials(price, contract_price, agent_commission, co_agent_commission)
  }

  render() {
    // Data
    const data = this.props.data
    const new_transaction = data.new_transaction
    const listing_added = new_transaction.listing_added
    let price
    let contract_price
    let agent_commission = 3
    let co_agent_commission = 1
    if (listing_added) {
      price = listing_added.price
      contract_price = listing_added.contract_price
      if (!contract_price)
        contract_price = price

      if (listing_added.agent_commission)
        agent_commission = listing_added.agent_commission
      if (listing_added.co_agent_commission)
        co_agent_commission = listing_added.co_agent_commission
    }

    return (
      <div>
        <div style={ S('t-100n absolute color-d0d4d9') }>Never leave that till tomorrow which you can do today.</div>
        <div style={ S('mb-40') }>
          <h1>Financials</h1>
        </div>
        <div>
          <Col sm={3}>
            Listing price $<br/>
            <Input ref="price" onKeyUp={ this.calculateFinancials.bind(this) } type="text" defaultValue={ price }/>
          </Col>
          <Col sm={3}>
            Contract price $<br/>
            <Input ref="contract_price" onKeyUp={ this.calculateFinancials.bind(this) } type="text" defaultValue={ contract_price }/>
          </Col>
          <Col sm={3}>
            Agent Commission %<br/>
            <Input ref="agent_commission" onKeyUp={ this.calculateFinancials.bind(this) } type="text" defaultValue={ agent_commission }/>
          </Col>
          <Col sm={3}>
            Co-Agent Commission %<br/>
            <Input ref="co_agent_commission" onKeyUp={ this.calculateFinancials.bind(this) } type="text" defaultValue={ co_agent_commission }/>
          </Col>
          <div className="clearfix"></div>
          <Col sm={6} />
          <Col sm={3}>
            est. payout $<br/>
            <div>{ helpers.numberWithCommas((contract_price * agent_commission * '.01').toFixed(2)) }</div>
          </Col>
          <Col sm={3}>
            est. payout $<br/>
            <div>{ helpers.numberWithCommas((contract_price * co_agent_commission * '.01').toFixed(2)) }</div>
          </Col>
        </div>
      </div>
    )
  }
}

// PropTypes
AddFinancials.propTypes = {
  data: React.PropTypes.object,
  calculateFinancials: React.PropTypes.func
}