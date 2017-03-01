// Dashboard/Transactions/New/Steps/AddFinancials.js
import React, { Component } from 'react'
import { Col, FormControl } from 'react-bootstrap'
import S from 'shorti'
import helpers from '../../../../../../utils/helpers'

export default class AddFinancials extends Component {

  calculateFinancials() {
    const price = this.priceInput.value
    const contract_price = this.contract_priceInput.value
    const buyers_agency_commission = this.buyers_agency_commissionInput.value
    const sub_agency_commission = this.sub_agency_commissionInput.value
    this.props.calculateFinancials(price, contract_price, buyers_agency_commission, sub_agency_commission)
  }

  render() {
    // Data
    const data = this.props.data
    const new_transaction = data.new_transaction
    const listing_added = new_transaction.listing_added
    let price
    let contract_price
    let buyers_agency_commission
    let sub_agency_commission
    if (listing_added) {
      price = listing_added.price
      contract_price = listing_added.contract_price
      if (!contract_price)
        contract_price = price

      if (listing_added.buyers_agency_commission)
        buyers_agency_commission = listing_added.buyers_agency_commission
      if (listing_added.sub_agency_commission)
        sub_agency_commission = listing_added.sub_agency_commission
    }
    const label_style = {
      ...S('font-13 color-bfc2c3'),
      ...{
        position: 'relative'
      }
    }
    const move_left = {
      left: '-15px'
    }
    const move_left_small = {
      left: '-2px'
    }
    const input_style = {
      border: 'none',
      fontSize: '18px',
      fontWeight: 'bold',
      position: 'relative',
      left: '-15px'
    }
    const container_style = {
      borderRight: '1px solid #f3f3f3',
      borderBottom: '1px solid #f3f3f3'
    }
    const dollar_style = {
      fontWeight: 'bold',
      ...S('absolute l-1n font-18 z-100 t-26 color-555')
    }
    const percent_style = {
      ...S('absolute z-100 l-35 t-27'),
      fontSize: '18px',
      fontWeight: 'bold'
    }
    let buyers_agency_commission_format = 0
    if (buyers_agency_commission)
      buyers_agency_commission_format = helpers.numberWithCommas((contract_price * buyers_agency_commission * '.01').toFixed(2))
    let sub_agency_commission_format = 0
    if (sub_agency_commission)
      sub_agency_commission_format = helpers.numberWithCommas((contract_price * sub_agency_commission * '.01').toFixed(2))
    return (
      <div>
        <div style={ S('t-100n absolute color-d0d4d9') }>Never leave that till tomorrow which you can do today.</div>
        <div style={ S('mb-40') }>
          <h1>Financials</h1>
        </div>
        <div>
          <Col sm={3} style={ container_style }>
            <span style={ { ...label_style, ...move_left } }>Listing price</span><br/>
            <span style={ dollar_style }>$</span><FormControl style={ input_style } inputRef={ ref => this.priceInput = ref } onKeyUp={ this.calculateFinancials.bind(this) } type="number" defaultValue={ price }/>
          </Col>
          <Col sm={3} style={ { ...container_style, ...{ paddingLeft: 30 } } }>
            <span style={ { ...label_style, ...move_left } }>Contract price</span><br/>
            <span style={ { ...dollar_style, ...{ left: 14 } } }>$</span><FormControl style={ input_style } inputRef={ ref => this.contract_priceInput = ref } onKeyUp={ this.calculateFinancials.bind(this) } type="number" defaultValue={ contract_price }/>
          </Col>
          <Col sm={3} style={ container_style }>
            <span style={ { ...label_style, ...move_left_small } }>Agent Commission</span><br/>
            <div style={ percent_style }>%</div>
            <FormControl maxLength={3} style={ { ...input_style, ...S('w-100p') } } inputRef={ ref => this.buyers_agency_commissionInput = ref } onKeyUp={ this.calculateFinancials.bind(this) } type="number" defaultValue={ buyers_agency_commission }/>
          </Col>
          <Col sm={3} style={ container_style }>
            <span style={ { ...label_style, ...move_left_small } }>Co-Agent Commission</span><br/>
            <div style={ percent_style }>%</div>
            <FormControl maxLength={3} style={ { ...input_style, ...S('w-100p') } } inputRef={ ref => this.sub_agency_commissionInput = ref } onKeyUp={ this.calculateFinancials.bind(this) } type="number" defaultValue={ sub_agency_commission }/>
          </Col>
          <div className="clearfix"></div>
          <Col sm={6} style={ { ...container_style, ...S('h-89') } }/>
          <Col sm={3} style={ { ...container_style, ...{ padding: 15 } } }>
            <span style={ label_style }>est. payout</span><br/>
            <div style={ S('font-28 color-35b863') }>
              <b>${ buyers_agency_commission_format }</b>
            </div>
          </Col>
          <Col sm={3} style={ { ...container_style, ...{ padding: 15 } } }>
            <span style={ label_style }>est. payout</span><br/>
            <div style={ S('font-28 color-82dd00') }>
              <b>${ sub_agency_commission_format }</b>
            </div>
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
