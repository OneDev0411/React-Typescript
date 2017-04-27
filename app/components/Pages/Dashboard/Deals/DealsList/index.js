import React from 'react'
import { browserHistory } from 'react-router'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import S from 'shorti'
import _ from 'underscore'
import { addressTitle } from '../../../../../utils/listing'

export default class DealsList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      deals: {}
    }
  }
  componentDidMount() {
    const { user, deals } = this.props

    if (deals)
      this.setState({ deals: deals.list })
  }

  componentWillReceiveProps(nextProps) {
    const { deals } = nextProps

    if (deals && _.size(deals.list) > _.size(this.state.deals))
      this.setState({ deals: deals.list })
  }

  create(type) {
    browserHistory.push(`/dashboard/deals/create/${type}`)
  }

  getDealAddress(deal) {
    const address = this.getValue(deal, 'street_address')

    if (address.endsWith(','))
      return address.substring(0, address.length - 1)
    return address
  }

  getPrice(deal) {
    const price = this.getValue(deal, 'list_price')
    return this.getNumberWithCommas(price)
  }

  getValue(deal, field) {
    if (deal.context && deal.context[field])
      return deal.context[field]
    else if (deal.proposed_values && deal.proposed_values[field])
      return deal.proposed_values[field]

    return '-'
  }

  getCoverImage(deal) {
    let src = null

    if (deal.listing)
      src = this.getValue(deal, 'photo')

    if (!src || src === '-')
      src = '/static/images/deals/home.svg'

    return <img
      style={S('mr-10 w-20')}
      src={src}
    />
  }

  getStatus(deal) {
    const status = this.getValue(deal, 'listing_status')

    if (!status || status === '-')
    return 'Coming Soon'
  }

  getClosingDate(deal) {
    return this.getValue(deal, 'closing_date')
  }

  getSortOrder(deal) {
    const status = this.getStatus(deal)
    const list = ['Incoming', 'Coming Soon', 'Active', 'Active Option Contract',
      'Active Contingent', 'Active Kick Out', 'Pending', 'Sold', 'Leased', 'Expired',
      'Temp Off Market', 'Cancelled', 'Withdrawn']

    const order = list.indexOf(status)
    return order > -1 ? order : list.length + 1
  }

  getNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  render() {
    const { deals } = this.state

    return (
      <div className="list">

        <Row className="toolbar">
          <Col lg={2} md={2} sm={2} className="vcenter">
            <span className="title">Deals</span>
          </Col>

          <Col lg={4} md={4} sm={4} className="vcenter">
            { _.size(deals) } total
          </Col>

          <Col lg={6} md={6} sm={6} className="vcenter right">
            <Button
              bsStyle="primary"
              onClick={this.create.bind(this, 'listing')}
            >
              New Listing
            </Button>

            <Button
              bsStyle="primary"
              onClick={this.create.bind(this, 'offer')}
            >
              Make an Offer
            </Button>
          </Col>
        </Row>

        {
          _.size(deals) > 0 &&
          <Grid className="table">
            <Row className="header">
              <Col md={4} sm={4} xs={4}>ADDRESS</Col>
              <Col md={2} sm={2} xs={2}>STATUS</Col>
              <Col md={2} sm={2} xs={2}>PRICE $</Col>
              <Col md={2} sm={2} xs={2}>SIDE</Col>
              <Col md={2} sm={2} xs={2}>CLOSING DATE</Col>
            </Row>
            {
              _.chain(deals)
              .sortBy(deal => this.getSortOrder(deal))
              .map(deal => (
                <Row
                  key={`DEAL_${deal.id}`}
                  onClick={() => browserHistory.push(`/dashboard/deals/${deal.id}`)}
                  className={`item type_${this.getStatus(deal)}`}
                >
                  <Col md={4} sm={4} xs={4}>
                    { this.getCoverImage(deal) }
                    { this.getDealAddress(deal) }
                  </Col>
                  <Col md={2} sm={2} xs={2}>{ this.getStatus(deal) }</Col>
                  <Col md={2} sm={2} xs={2}>{ this.getPrice(deal) } </Col>
                  <Col md={2} sm={2} xs={2}>{ this.getValue(deal, 'deal_type') }</Col>
                  <Col md={2} sm={2} xs={2}>{ this.getClosingDate(deal) }</Col>
                </Row>
                ))
              .value()
            }
          </Grid>
        }
      </div>
    )
  }
}
